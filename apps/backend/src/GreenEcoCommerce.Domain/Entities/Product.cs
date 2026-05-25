namespace GreenEcoCommerce.Domain.Entities;

public class Product
{
    public Guid Id { get; init; } = Guid.CreateVersion7();
    public required Guid CategoryId { get; set; }
    public required string Name { get; set; }
    public required string Description { get; set; }
    public required decimal Price { get; set; }
    public required int StockQty { get; set; }
    public required float CarbonIndex { get; set; }
    public required string MaterialOrigin { get; set; }
    public required float DecomposePercent { get; set; }
    public required float RecyclePercent { get; set; }

    // Navigation properties
    public Category Category { get; init; } = null!;
    public ICollection<ProductImage> Images { get; init; } = new HashSet<ProductImage>();
    public ICollection<CartItem> CartItems { get; init; } = new HashSet<CartItem>();
    public ICollection<OrderItem> OrderItems { get; init; } = new HashSet<OrderItem>();
}
