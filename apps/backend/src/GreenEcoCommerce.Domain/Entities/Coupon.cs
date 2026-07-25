using GreenEcoCommerce.Domain.Enums;
using GreenEcoCommerce.Domain.Interfaces;

namespace GreenEcoCommerce.Domain.Entities;

public class Coupon : IHasCreatedAt
{
    public Guid Id { get; set; } = Guid.CreateVersion7();
    public required string Code { get; set; }
    public CouponDiscountTypeEnum DiscountType { get; set; } = CouponDiscountTypeEnum.Percent;
    public decimal DiscountValue { get; set; }
    public decimal MinOrderAmount { get; set; }
    public int MaxUses { get; set; }
    public int UsedCount { get; set; }
    public DateTimeOffset ExpiresAt { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTimeOffset CreatedAt { get; set; }
}
