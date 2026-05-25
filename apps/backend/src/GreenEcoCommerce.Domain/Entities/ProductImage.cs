namespace GreenEcoCommerce.Domain.Entities;

public class ProductImage
{
    public Guid Id { get; init; } = Guid.CreateVersion7();
    public required Guid ProductId { get; set; }
    public required string AzureUrl { get; set; }
    public required bool IsPrimary { get; set; }

    // Navigation property
    public Product Product { get; init; } = null!;
}
