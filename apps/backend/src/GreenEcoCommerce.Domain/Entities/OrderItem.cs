namespace GreenEcoCommerce.Domain.Entities;

public class OrderItem
{
    public Guid Id { get; init; } = Guid.CreateVersion7();
    public required Guid OrderId { get; set; }
    public required Guid ProductId { get; set; }
    public required int Quantity { get; set; }
    public required decimal UnitPrice { get; set; }

    // Navigation properties
    public Order Order { get; init; } = null!;
    public Product Product { get; init; } = null!;
}
