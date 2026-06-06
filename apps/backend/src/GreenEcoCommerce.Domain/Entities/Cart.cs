using GreenEcoCommerce.Domain.Interfaces;

namespace GreenEcoCommerce.Domain.Entities;

public class Cart: IHasUpdatedAt
{
    public Guid Id { get; set; } = Guid.CreateVersion7();
    public Guid UserId { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }

    // Navigation Properties
    public User? User { get; set; }
    public ICollection<CartItem> CartItems { get; set; } = new HashSet<CartItem>();
}
