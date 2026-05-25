namespace GreenEcoCommerce.Domain.Entities;

public class Cart
{
    public Guid Id { get; init; } = Guid.CreateVersion7();
    public required Guid UserId { get; set; }
    public required DateTime UpdatedAt { get; set; }

    // Navigation properties
    public User User { get; init; } = null!;
    public ICollection<CartItem> CartItems { get; init; } = new HashSet<CartItem>();
}
