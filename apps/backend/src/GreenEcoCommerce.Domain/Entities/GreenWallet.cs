using GreenEcoCommerce.Domain.Interfaces;

namespace GreenEcoCommerce.Domain.Entities;

public class GreenWallet: IHasUpdatedAt
{
    public Guid Id { get; set; } = Guid.CreateVersion7();
    public Guid UserId { get; set; }
    public decimal Balance { get; set; }
    public decimal EarnedTotal { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }

    // Navigation Properties
    public User User { get; set; } = null!;
    public ICollection<PointTransaction> Transactions { get; set; } = new HashSet<PointTransaction>();
}
