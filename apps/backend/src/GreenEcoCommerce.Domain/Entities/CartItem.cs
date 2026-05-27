namespace GreenEcoCommerce.Domain.Entities;

public class CartItem
{
    public Guid Id { get; set; } = Guid.CreateVersion7();
    public Guid CartId { get; set; }
    public Guid ProductId { get; set; }
    public int Quantity { get; set; }

    // Navigation Properties
    public Cart? Cart { get; set; }
    public Product? Product { get; set; }
}
