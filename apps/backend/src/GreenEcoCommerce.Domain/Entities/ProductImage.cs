namespace GreenEcoCommerce.Domain.Entities;

public class ProductImage
{
    public Guid Id { get; set; } = Guid.CreateVersion7();
    public Guid ProductId { get; set; }
    public required string AzureUrl { get; set; }
    public bool IsPrimary { get; set; }

    // Navigation Properties
    public Product? Product { get; set; }
}
