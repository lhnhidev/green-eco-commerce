namespace GreenEcoCommerce.Domain.Entities;

public class Voucher
{
    public Guid Id { get; set; } = Guid.CreateVersion7();
    public Guid? UserId { get; set; }
    public required string Code { get; set; }
    public decimal DiscountValue { get; set; }
    public decimal PointsCost { get; set; }
    public DateTimeOffset ExpiresAt { get; set; }
    public bool IsUsed { get; set; }

    // Navigation Properties
    public User? User { get; set; }
    public ICollection<PointTransaction> PointTransactions { get; set; } = new HashSet<PointTransaction>();
    public Order? AppliedOrder { get; set; }
}
