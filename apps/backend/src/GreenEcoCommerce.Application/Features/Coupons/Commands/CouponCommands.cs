using FluentValidation;
using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Enums;
using GreenEcoCommerce.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

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
            var normalizedCode = cmd.Code.ToUpperInvariant();
            if (await db.Coupons.AnyAsync(c => c.Code == normalizedCode, ct))
            {
                throw new BadRequestException("A coupon with this code already exists.");
            }

            var coupon = new Coupon
            {
                Code = normalizedCode,
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

            var normalizedCode = cmd.Code.ToUpperInvariant();
            if (await db.Coupons.AnyAsync(c => c.Code == normalizedCode && c.Id != cmd.Id, ct))
            {
                throw new BadRequestException("A coupon with this code already exists.");
            }

            coupon.Code = normalizedCode;
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

    public class Validator : AbstractValidator<UpdateCouponCommand>
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
