using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Application.Queries;
using GreenEcoCommerce.Domain.Enums;
using GreenEcoCommerce.Domain.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Checkout;

// Read-only pricing preview used to size a payment (e.g. a Stripe PaymentIntent) before the order
// exists. Mirrors the pricing rules in CheckoutCommand — keep the two in sync — but performs no
// mutations (no stock decrement, no coupon claim, no wallet withdrawal); those only happen once
// CheckoutCommand actually places the order.
public static class CheckoutPricing
{
    public static async Task<decimal> ComputeFinalPriceAsync(
            IApplicationDbContext dbContext, Guid userId, int pointsToRedeem, string? couponCode, CancellationToken ct)
    {
        var cart = await dbContext.Carts.OfUser(userId).IncludeCartItems().FirstOrDefaultAsync(ct);
        if (cart == null) { throw new NotFoundException("Cart not found for the user."); }
        if (cart.CartItems.Count == 0) { throw new BadRequestException("Cart is empty."); }

        decimal totalPrice = cart.CartItems.Sum(item => item.Product.Price * item.Quantity);

        decimal discountAmount;
        if (!string.IsNullOrWhiteSpace(couponCode))
        {
            var coupon = await dbContext.Coupons
                    .FirstOrDefaultAsync(c => c.Code == couponCode.ToUpperInvariant() && c.IsActive, ct);

            if (coupon == null || coupon.ExpiresAt < DateTimeOffset.UtcNow || coupon.UsedCount >= coupon.MaxUses || totalPrice < coupon.MinOrderAmount)
            {
                throw new BadRequestException("This coupon is invalid, expired, or not applicable to this order.");
            }

            discountAmount = coupon.DiscountType == CouponDiscountTypeEnum.Percent
                    ? Math.Round(totalPrice * (coupon.DiscountValue / 100), 2)
                    : Math.Min(coupon.DiscountValue, totalPrice);
        }
        else if (pointsToRedeem > 0)
        {
            var wallet = await dbContext.GreenWallets.OfUser(userId).FirstOrDefaultAsync(ct);
            if (wallet == null) { throw new NotFoundException("Green wallet not found for the user."); }
            if (wallet.Balance < pointsToRedeem) { throw new BadRequestException("Insufficient eco points."); }

            // 20 points = $1 (or 1 point = $0.05)
            discountAmount = Math.Min(pointsToRedeem / 20m, totalPrice);
        }
        else
        {
            discountAmount = 0;
        }

        decimal finalPrice = totalPrice - discountAmount;
        if (finalPrice < 0) { throw new InvalidOperationException("Final price cannot be negative after applying discounts."); }

        return finalPrice;
    }
}
