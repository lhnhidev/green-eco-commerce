using FluentValidation;
using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Enums;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Coupons.Commands;

public record CreateCouponCommand(
    string Code,
    CouponDiscountTypeEnum DiscountType,
    decimal DiscountValue,
    decimal MinOrderAmount,
    int MaxUses,
    DateTimeOffset ExpiresAt
) : IRequest<CouponDto>
{
    public class Handler(IApplicationDbContext db) : IRequestHandler<CreateCouponCommand, CouponDto>
    {
        public async Task<CouponDto> Handle(CreateCouponCommand cmd, CancellationToken ct)
        {
            var coupon = new Coupon
            {
                Code = cmd.Code.ToUpperInvariant(),
                DiscountType = cmd.DiscountType,
                DiscountValue = cmd.DiscountValue,
                MinOrderAmount = cmd.MinOrderAmount,
                MaxUses = cmd.MaxUses,
                ExpiresAt = cmd.ExpiresAt,
            };
            db.Coupons.Add(coupon);
            await db.SaveChangesAsync(ct);
            return coupon.ToDto();
        }
    }

    public class Validator : AbstractValidator<CreateCouponCommand>
    {
        public Validator()
        {
            RuleFor(x => x.Code).NotEmpty().MaximumLength(50);
            RuleFor(x => x.DiscountValue).GreaterThan(0);
            RuleFor(x => x.MaxUses).GreaterThan(0);
            RuleFor(x => x.ExpiresAt).GreaterThan(DateTimeOffset.UtcNow);
        }
    }
}

public record UpdateCouponCommand(
    Guid Id,
    string Code,
    CouponDiscountTypeEnum DiscountType,
    decimal DiscountValue,
    decimal MinOrderAmount,
    int MaxUses,
    DateTimeOffset ExpiresAt,
    bool IsActive
) : IRequest<CouponDto?>
{
    public class Handler(IApplicationDbContext db) : IRequestHandler<UpdateCouponCommand, CouponDto?>
    {
        public async Task<CouponDto?> Handle(UpdateCouponCommand cmd, CancellationToken ct)
        {
            var coupon = await db.Coupons.FindAsync([cmd.Id], ct);
            if (coupon is null) return null;
            coupon.Code = cmd.Code.ToUpperInvariant();
            coupon.DiscountType = cmd.DiscountType;
            coupon.DiscountValue = cmd.DiscountValue;
            coupon.MinOrderAmount = cmd.MinOrderAmount;
            coupon.MaxUses = cmd.MaxUses;
            coupon.ExpiresAt = cmd.ExpiresAt;
            coupon.IsActive = cmd.IsActive;
            await db.SaveChangesAsync(ct);
            return coupon.ToDto();
        }
    }
}

public record DeleteCouponCommand(Guid Id) : IRequest<bool>
{
    public class Handler(IApplicationDbContext db) : IRequestHandler<DeleteCouponCommand, bool>
    {
        public async Task<bool> Handle(DeleteCouponCommand cmd, CancellationToken ct)
        {
            var coupon = await db.Coupons.FindAsync([cmd.Id], ct);
            if (coupon is null) return false;
            db.Coupons.Remove(coupon);
            await db.SaveChangesAsync(ct);
            return true;
        }
    }
}
