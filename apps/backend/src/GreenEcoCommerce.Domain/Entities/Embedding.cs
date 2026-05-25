namespace GreenEcoCommerce.Domain.Entities;

public class Embedding
{
    public Guid Id { get; init; } = Guid.CreateVersion7();
    public required Guid DocumentId { get; set; }
    public required string ChunkText { get; set; }
    public required string VectorId { get; set; }

    // Navigation property
    public Document Document { get; init; } = null!;
}
