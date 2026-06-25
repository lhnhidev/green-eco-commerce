using GreenEcoCommerce.Domain.Interfaces;

namespace GreenEcoCommerce.Domain.Entities;

public class GreenWallet: IHasUpdatedAt
{
    public Guid Id { get; set; } = Guid.CreateVersion7();
    public Guid UserId { get; set; }
    public decimal Balance { get; set; } = 0;
    public decimal EarnedTotal { get; set; } = 0;
    public DateTimeOffset? UpdatedAt { get; set; } = DateTimeOffset.UtcNow;

    // Navigation Properties
    public User User { get; set; } = null!;
    public ICollection<PointTransaction> Transactions { get; set; } = new HashSet<PointTransaction>();
}
