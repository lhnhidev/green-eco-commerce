namespace GreenEcoCommerce.Domain.Entities;

public class GreenPoint
{
    public Guid Id { get; init; } = Guid.CreateVersion7();
    public required Guid UserId { get; set; }
    public required float Balance { get; set; }
    public required float EarnedTotal { get; set; }
    public DateTime UpdatedAt { get; init; } =  DateTime.UtcNow;

    // Navigation properties
    public User User { get; init; } = null!;
    public ICollection<Voucher> Vouchers { get; init; } = new HashSet<Voucher>();
}
