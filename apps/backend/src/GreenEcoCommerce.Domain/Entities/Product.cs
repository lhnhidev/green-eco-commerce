using GreenEcoCommerce.Domain.Interfaces;

namespace GreenEcoCommerce.Domain.Entities;

public class Product : IHasCreatedAt
{
    public Guid Id { get; set; } = Guid.CreateVersion7();
    public Guid CategoryId { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public int StockQty { get; set; }
    public decimal CarbonIndex { get; set; }
    public decimal BaselineCarbonIndex { get; set; }
    public decimal DecomposePercent { get; set; }
    public decimal RecyclePercent { get; set; }
    public string[] ImageUrl { get; set; } = [];
    public bool IsActive { get; set; } = true;
    public DateTimeOffset CreatedAt { get; set; }

    // Navigation Properties
    public Category Category { get; set; } = null!;
    public ICollection<CartItem> CartItems { get; set; } = new HashSet<CartItem>();
    public ICollection<OrderItem> OrderItems { get; set; } = new HashSet<OrderItem>();
    public ICollection<Material> Materials { get; set; } = new HashSet<Material>();
    public ICollection<Review> Reviews { get; set; } = new HashSet<Review>();
}
