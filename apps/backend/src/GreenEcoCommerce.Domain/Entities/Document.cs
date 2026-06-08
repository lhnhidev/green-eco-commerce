using GreenEcoCommerce.Domain.Enums;
using GreenEcoCommerce.Domain.Interfaces;

namespace GreenEcoCommerce.Domain.Entities;

public class Document: IHasCreatedAt
{
    public Guid Id { get; set; } = Guid.CreateVersion7();
    public Guid UploadedBy { get; set; }
    public required string FileName { get; set; }
    public DocumentFileTypeEnum FileType { get; set; }
    public required string FileUrl { get; set; }
    public DateTimeOffset CreatedAt { get; set; }

    // Navigation Properties
    public User Uploader { get; set; } = null!;
    public ICollection<Embedding> Embeddings { get; set; } = new HashSet<Embedding>();
}
