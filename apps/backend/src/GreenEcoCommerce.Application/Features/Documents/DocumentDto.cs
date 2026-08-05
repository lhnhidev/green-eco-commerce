using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Enums;
using Riok.Mapperly.Abstractions;

namespace GreenEcoCommerce.Application.Features.Documents;

public record DocumentDto(
    Guid Id,
    Guid UploadedBy,
    string FileName,
    DocumentFileTypeEnum FileType,
    string FileUrl,
    DateTimeOffset CreatedAt,
    int EmbeddingCount
);

[Mapper]
public static partial class DocumentDtoMapper
{
    [MapperRequiredMapping(RequiredMappingStrategy.Target)]
    [MapProperty(nameof(Document.Embeddings), nameof(DocumentDto.EmbeddingCount), Use = nameof(GetEmbeddingCount))]
    public static partial DocumentDto ToDto(this Document document);

    public static partial IQueryable<DocumentDto> ProjectToDto(this IQueryable<Document> documents);

    [UserMapping(Default = false)]
    private static int GetEmbeddingCount(ICollection<Embedding> embeddings) => embeddings.Count;
}
