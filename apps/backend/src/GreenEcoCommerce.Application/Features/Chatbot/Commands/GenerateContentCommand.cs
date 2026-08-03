using System.Text;
using FluentValidation;
using GreenEcoCommerce.Application.Interfaces.Chatbot;
using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Enums;
using GreenEcoCommerce.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Chatbot.Commands;

public record GenerateContentCommand(Guid UserId, Guid? IdSectionMessage, string Prompt)
        : IRequest<GenerateContentCommand.Response>
{
    public record Response(Guid SessionId, string Message);

    public class Validator : AbstractValidator<GenerateContentCommand>
    {
        public Validator()
        {
            RuleFor(x => x.Prompt)
                    .NotEmpty().WithMessage("Prompt must not be empty.")
                    .MaximumLength(3000).WithMessage("Prompt cannot exceed 3000 characters.");
        }
    }

    private const int HistoryMessageCount = 10;
    private const int TopKnowledgeChunks = 4;
    private const int TopCandidateProducts = 5;

    private const string SystemInstructionTemplate = """
        You are the Eco Assistant for GreenEcoCommerce, an eco-friendly e-commerce store. You help customers with:
        - Comparing products (e.g. "why is this bamboo toothbrush better than a plastic one?")
        - Recycling / disposal guidance for used or empty products
        - Recommending suitable eco-friendly products for a stated need
        - Explaining a product's carbon footprint (CarbonIndex = actual emissions, BaselineCarbonIndex = conventional-alternative emissions; the difference is CO2 saved)

        Only state prices, CO2 figures, or product facts that appear in the CONTEXT sections below. If the context
        doesn't contain what's needed to answer, say you don't have that information rather than guessing. Keep
        answers concise and friendly, in the same language the user wrote in.
        {0}
        {1}
        """;

    public class Handler(IApplicationDbContext dbContext, IAIService aiService)
            : IRequestHandler<GenerateContentCommand, Response>
    {
        public async Task<Response> Handle(GenerateContentCommand request, CancellationToken ct)
        {
            if (string.IsNullOrWhiteSpace(request.Prompt))
            {
                throw new BadRequestException("Prompt must not be empty.");
            }

            var session = request.IdSectionMessage.HasValue
                    ? await dbContext.ChatSessions.FirstOrDefaultAsync(
                            s => s.Id == request.IdSectionMessage.Value && s.UserId == request.UserId, ct)
                    : null;

            if (session == null)
            {
                session = new ChatSession
                {
                    UserId = request.UserId,
                    Title = request.Prompt.Length > 60 ? request.Prompt[..60] : request.Prompt,
                    CreatedAt = DateTimeOffset.UtcNow
                };
                await dbContext.ChatSessions.AddAsync(session, ct);
                await dbContext.SaveChangesAsync(ct);
            }

            var historyMessages = await dbContext.ChatMessages
                    .Where(m => m.SessionId == session.Id)
                    .OrderByDescending(m => m.CreatedAt)
                    .Take(HistoryMessageCount)
                    .OrderBy(m => m.CreatedAt)
                    .ToListAsync(ct);

            var history = historyMessages
                    .Select(m => new HistoryChatInSection(
                            m.Role == ChatRoleEnum.Bot ? ChatRole.Bot : ChatRole.User, m.Content))
                    .ToList();

            string knowledgeBaseBlock = await BuildKnowledgeBaseBlockAsync(request.Prompt, ct);
            string candidateProductsBlock = await BuildCandidateProductsBlockAsync(request.Prompt, ct);
            string systemInstruction = string.Format(SystemInstructionTemplate, knowledgeBaseBlock, candidateProductsBlock);

            string replyText;
            try
            {
                replyText = await aiService.GenerateContentAsync(request.Prompt, history, systemInstruction, ct);
            }
            catch (Exception ex)
            {
                throw new OverviewException($"Error generating content: {ex.Message}");
            }

            await dbContext.ChatMessages.AddRangeAsync(
                [
                    new ChatMessage { SessionId = session.Id, Role = ChatRoleEnum.User, Content = request.Prompt, CreatedAt = DateTimeOffset.UtcNow },
                    new ChatMessage { SessionId = session.Id, Role = ChatRoleEnum.Bot, Content = replyText, CreatedAt = DateTimeOffset.UtcNow }
                ],
                ct);
            await dbContext.SaveChangesAsync(ct);

            return new Response(session.Id, replyText);
        }

        private async Task<string> BuildKnowledgeBaseBlockAsync(string prompt, CancellationToken ct)
        {
            var embeddings = await dbContext.Embeddings
                    .Select(e => new { e.ChunkText, e.VectorData })
                    .ToListAsync(ct);

            if (embeddings.Count == 0)
            {
                return string.Empty;
            }

            float[] promptVector;
            try
            {
                promptVector = await aiService.GetEmbeddingsAsync(prompt, ct);
            }
            catch
            {
                return string.Empty;
            }

            var topChunks = embeddings
                    .Select(e => new { e.ChunkText, Similarity = CosineSimilarity(promptVector, e.VectorData) })
                    .OrderByDescending(e => e.Similarity)
                    .Take(TopKnowledgeChunks)
                    .Where(e => e.Similarity > 0)
                    .ToList();

            if (topChunks.Count == 0)
            {
                return string.Empty;
            }

            var sb = new StringBuilder();
            sb.AppendLine();
            sb.AppendLine("KNOWLEDGE BASE (recycling / sustainability reference material):");
            foreach (var chunk in topChunks)
            {
                sb.AppendLine($"- {chunk.ChunkText}");
            }

            return sb.ToString();
        }

        private async Task<string> BuildCandidateProductsBlockAsync(string prompt, CancellationToken ct)
        {
            var keywords = prompt
                    .Split((char[]?)null, StringSplitOptions.RemoveEmptyEntries)
                    .Select(w => w.ToLowerInvariant())
                    .Where(w => w.Length >= 4)
                    .Distinct()
                    .Take(8)
                    .ToArray();

            if (keywords.Length == 0)
            {
                return string.Empty;
            }

            // Filtered in-memory rather than via a translated `keywords.Any(w => p.Name.Contains(w))` predicate,
            // since that shape of query isn't reliably translatable across EF providers.
            var activeProducts = await dbContext.Products
                    .Where(p => p.IsActive)
                    .Select(p => new
                    {
                        p.Name,
                        p.Price,
                        p.CarbonIndex,
                        p.BaselineCarbonIndex,
                        p.DecomposePercent,
                        p.RecyclePercent
                    })
                    .ToListAsync(ct);

            var products = activeProducts
                    .Where(p => keywords.Any(w => p.Name.ToLowerInvariant().Contains(w)))
                    .Take(TopCandidateProducts)
                    .ToList();

            if (products.Count == 0)
            {
                return string.Empty;
            }

            var sb = new StringBuilder();
            sb.AppendLine();
            sb.AppendLine("CANDIDATE PRODUCTS (real catalog data, only mention these by name if relevant):");
            foreach (var p in products)
            {
                sb.AppendLine(
                        $"- {p.Name}: ${p.Price:0.00}, CarbonIndex {p.CarbonIndex}kg CO2 (baseline {p.BaselineCarbonIndex}kg), " +
                        $"decompose {p.DecomposePercent}%, recycle {p.RecyclePercent}%");
            }

            return sb.ToString();
        }

        private static double CosineSimilarity(float[] a, float[] b)
        {
            if (a.Length != b.Length || a.Length == 0)
            {
                return 0;
            }

            double dot = 0, normA = 0, normB = 0;
            for (int i = 0; i < a.Length; i++)
            {
                dot += a[i] * b[i];
                normA += a[i] * a[i];
                normB += b[i] * b[i];
            }

            if (normA == 0 || normB == 0)
            {
                return 0;
            }

            return dot / (Math.Sqrt(normA) * Math.Sqrt(normB));
        }
    }
}
