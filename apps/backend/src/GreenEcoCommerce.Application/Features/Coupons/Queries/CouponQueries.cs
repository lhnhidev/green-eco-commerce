using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Domain.Enums;
using GreenEcoCommerce.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Coupons.Queries;

public record GetAllCouponsQuery : IRequest<CouponDto[]>
{
    public class Handler(IApplicationDbContext db) : IRequestHandler<GetAllCouponsQuery, CouponDto[]>
    {
        public async Task<CouponDto[]> Handle(GetAllCouponsQuery _, CancellationToken ct) =>
            await db.Coupons.OrderByDescending(c => c.CreatedAt).ProjectToDto().ToArrayAsync(ct);
    }
}

public record ValidateCouponQuery(string Code, decimal OrderTotal) : IRequest<ValidateCouponResponse>
{
    public class Handler(IApplicationDbContext db) : IRequestHandler<ValidateCouponQuery, ValidateCouponResponse>
    {
        public async Task<ValidateCouponResponse> Handle(ValidateCouponQuery req, CancellationToken ct)
        {
            var coupon = await db.Coupons
                .FirstOrDefaultAsync(c => c.Code == req.Code.ToUpperInvariant() && c.IsActive, ct)
                ?? throw new NotFoundException($"Coupon '{req.Code}' not found or inactive.");

            if (coupon.ExpiresAt < DateTimeOffset.UtcNow)
                throw new InvalidOperationException("Coupon has expired.");

            if (coupon.UsedCount >= coupon.MaxUses)
                throw new InvalidOperationException("Coupon has reached its maximum usage limit.");

            if (req.OrderTotal < coupon.MinOrderAmount)
                throw new InvalidOperationException($"Minimum order amount is ${coupon.MinOrderAmount:F2}.");

            var discountAmount = coupon.DiscountType == CouponDiscountTypeEnum.Percent
                ? Math.Round(req.OrderTotal * (coupon.DiscountValue / 100), 2)
                : Math.Min(coupon.DiscountValue, req.OrderTotal);

            return new ValidateCouponResponse(coupon.Id, coupon.Code, coupon.DiscountType, coupon.DiscountValue, discountAmount);
        }
    }
}
