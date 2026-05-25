using GreenEcoCommerce.Domain.Enums;

namespace GreenEcoCommerce.Domain.Entities;

public class Document
{
    public Guid Id { get; init; } = Guid.CreateVersion7();
    public required Guid UploadedBy { get; set; }
    public required string FileName { get; set; }
    public required DocumentTypeEnum FileType { get; set; }
    public required string AzureUrl { get; set; }

    // Navigation properties
    public User UploadedByUser { get; init; } = null!;
    public ICollection<Embedding> Embeddings { get; init; } = new HashSet<Embedding>();
}
