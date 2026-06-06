namespace GreenEcoCommerce.Domain.Entities;

public class Product
{
    public Guid Id { get; set; } = Guid.CreateVersion7();
    public Guid CategoryId { get; set; }
    public required string Sku { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public int StockQty { get; set; }
    public float CarbonIndex { get; set; }
    public required string MaterialOrigin { get; set; }
    public float DecomposePercent { get; set; }
    public float RecyclePercent { get; set; }
    public bool IsActive { get; set; } = true;

    // Navigation Properties
    public Category? Category { get; set; }
    public ICollection<ProductImage> Images { get; set; } = new HashSet<ProductImage>();
    public ICollection<CartItem> CartItems { get; set; } = new HashSet<CartItem>();
    public ICollection<OrderItem> OrderItems { get; set; } = new HashSet<OrderItem>();
}
