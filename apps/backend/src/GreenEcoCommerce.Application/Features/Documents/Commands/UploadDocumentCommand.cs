using System.Text;
using DocumentFormat.OpenXml.Packaging;
using GreenEcoCommerce.Application.Interfaces.Chatbot;
using GreenEcoCommerce.Application.Interfaces.Environment;
using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Application.Interfaces.Storage;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Enums;
using MediatR;
using Microsoft.Extensions.Logging;
using UglyToad.PdfPig;

namespace GreenEcoCommerce.Application.Features.Documents.Commands;

public record UploadDocumentCommand(Guid UserId, string FileName, Stream FileStream) : IRequest<DocumentDto>
{
    public class Handler(
        IApplicationDbContext dbContext,
        IApplicationEnvironment env,
        IAIService aiService,
        IFileStorageService fileStorage,
        ILogger<Handler> logger) : IRequestHandler<UploadDocumentCommand, DocumentDto>
    {
        public async Task<DocumentDto> Handle(UploadDocumentCommand request, CancellationToken ct)
        {
            string ext = Path.GetExtension(request.FileName).ToLowerInvariant();

            DocumentFileTypeEnum fileType = ext switch
            {
                ".pdf" => DocumentFileTypeEnum.Pdf,
                ".txt" => DocumentFileTypeEnum.Txt,
                ".docx" or ".doc" => DocumentFileTypeEnum.Docx,
                _ => DocumentFileTypeEnum.Txt
            };

            string fileUrl = await fileStorage.SaveFileAsync(request.FileStream, request.FileName, "docs", ct);
            string filePath = Path.Combine(env.WebRootPath, fileUrl.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));

            var doc = new Document
            {
                FileName = request.FileName,
                FileType = fileType,
                FileUrl = fileUrl,
                UploadedBy = request.UserId,
                CreatedAt = DateTimeOffset.UtcNow
            };

            string fullText = string.Empty;

            try
            {
                if (fileType == DocumentFileTypeEnum.Txt)
                {
                    fullText = await File.ReadAllTextAsync(filePath, ct);
                }
                else if (fileType == DocumentFileTypeEnum.Pdf)
                {
                    using var document = PdfDocument.Open(filePath);
                    var sb = new StringBuilder();
                    foreach (var page in document.GetPages())
                    {
                        sb.AppendLine(page.Text);
                    }
                    fullText = sb.ToString();
                }
                else
                {
                    using var wordDocument = WordprocessingDocument.Open(filePath, false);
                    fullText = wordDocument.MainDocumentPart?.Document?.Body?.InnerText ?? string.Empty;
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error extracting text from {FileName}", request.FileName);
            }

            if (!string.IsNullOrWhiteSpace(fullText))
            {
                int chunkSize = 2000;
                var chunks = new List<string>();
                for (int i = 0; i < fullText.Length; i += chunkSize)
                {
                    string chunk = fullText.Substring(i, Math.Min(chunkSize, fullText.Length - i));
                    if (!string.IsNullOrWhiteSpace(chunk))
                    {
                        chunks.Add(chunk);
                    }
                }

                // Giới hạn 4 request đồng thời tới Gemini; mỗi chunk vẫn try/catch độc lập
                // như trước để 1 chunk lỗi không làm mất embedding của các chunk còn lại.
                using var semaphore = new SemaphoreSlim(4);
                var embeddingTasks = chunks.Select(async chunk =>
                {
                    await semaphore.WaitAsync(ct);
                    try
                    {
                        float[] vector = await aiService.GetEmbeddingsAsync(chunk, ct);
                        return new Embedding { DocumentId = doc.Id, ChunkText = chunk, VectorData = vector };
                    }
                    catch (Exception ex)
                    {
                        logger.LogError(ex, "Error getting embedding for chunk");
                        return null;
                    }
                    finally
                    {
                        semaphore.Release();
                    }
                });

                var embeddings = await Task.WhenAll(embeddingTasks);
                foreach (var embedding in embeddings)
                {
                    if (embedding is not null)
                    {
                        doc.Embeddings.Add(embedding);
                    }
                }
            }
            else
            {
                // Fallback chunk to show the file was ingested but empty
                string fallbackText = $"[Content of {request.FileName} could not be extracted or is empty]";
                float[] vector = await aiService.GetEmbeddingsAsync(fallbackText, ct);
                doc.Embeddings.Add(new Embedding
                {
                    DocumentId = doc.Id,
                    ChunkText = fallbackText,
                    VectorData = vector
                });
            }

            await dbContext.Documents.AddAsync(doc, ct);
            await dbContext.SaveChangesAsync(ct);

            return doc.ToDto();
        }
    }
}
