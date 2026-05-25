namespace GreenEcoCommerce.Domain.Entities;

public class Voucher
{
    public Guid Id { get; init; } = Guid.CreateVersion7();
    public required Guid GreenPointId { get; set; }
    public required string Code { get; set; }
    public required decimal DiscountValue { get; set; }
    public required float PointsCost { get; set; }
    public required DateTime ExpiresAt { get; set; }
    public required bool IsUsed { get; set; }

    // Navigation property
    public GreenPoint GreenPoint { get; init; } = null!;
}
