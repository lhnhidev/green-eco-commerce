namespace GreenEcoCommerce.Domain.Entities;

public class Embedding
{
    public Guid Id { get; set; } = Guid.CreateVersion7();
    public Guid DocumentId { get; set; }
    public required string ChunkText { get; set; }
    public required string VectorId { get; set; }

    // Navigation Properties
    public Document Document { get; set; } = null!;
}
