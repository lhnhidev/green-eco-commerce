using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Enums;
using Riok.Mapperly.Abstractions;

namespace GreenEcoCommerce.Application.Features.Coupons;

public record CouponDto(
    Guid Id,
    string Code,
    CouponDiscountTypeEnum DiscountType,
    decimal DiscountValue,
    decimal MinOrderAmount,
    int MaxUses,
    int UsedCount,
    DateTimeOffset ExpiresAt,
    bool IsActive,
    DateTimeOffset CreatedAt
);

public record ValidateCouponResponse(
    Guid CouponId,
    string Code,
    CouponDiscountTypeEnum DiscountType,
    decimal DiscountValue,
    decimal DiscountAmount // computed based on cart total
);

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
public static partial class CouponDtoMapper
{
    public static partial CouponDto ToDto(this Coupon coupon);
    public static partial IQueryable<CouponDto> ProjectToDto(this IQueryable<Coupon> coupons);
}
