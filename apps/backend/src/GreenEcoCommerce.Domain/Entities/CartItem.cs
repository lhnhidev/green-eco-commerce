namespace GreenEcoCommerce.Domain.Entities;

public class CartItem
{
    public Guid Id { get; init; } = Guid.CreateVersion7();
    public required Guid CartId { get; set; }
    public required Guid ProductId { get; set; }
    public required int Quantity { get; set; }

    // Navigation properties
    public Cart Cart { get; init; } = null!;
    public Product Product { get; init; } = null!;
}
