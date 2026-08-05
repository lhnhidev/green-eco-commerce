using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Application.Queries;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Orders.Commands;

// Shared by CancelOrderCommand (user self-service) and UpdateOrderStatusCommand (admin), so
// both paths reverse stock, Green Points, coupon usage, and payment status the same way
// instead of the admin path silently skipping all of it.
internal static class OrderCancellationEffects
{
    public static async Task ReverseAsync(IApplicationDbContext dbContext, Order order, CancellationToken ct)
    {
        // Restore stock for each item
        foreach (var item in order.OrderItems)
        {
            item.Product.StockQty += item.Quantity;
        }

        // Reverse the Green Points effect of this order (EarnedPoints is negative
        // when points were redeemed at checkout, positive when points were earned).
        var wallet = await dbContext.GreenWallets.OfUser(order.UserId).FirstOrDefaultAsync(ct);
        if (wallet != null && order.EarnedPoints != 0)
        {
            if (order.EarnedPoints < 0)
            {
                int refund = -order.EarnedPoints;
                await dbContext.DepositWalletAsync(wallet, refund, $"Refund for cancelled order {order.Id}", order.Id, ct);
            }
            else
            {
                // Claw back points earned from this order, clamped to what's still available
                // (the user may have already spent some of it elsewhere).
                int clawback = Math.Min(wallet.Balance, order.EarnedPoints);
                if (clawback > 0)
                {
                    wallet.Balance -= clawback;
                    wallet.EarnedTotal -= clawback;

                    await dbContext.PointTransactions.AddAsync(
                        new PointTransaction
                        {
                            WalletId = wallet.Id,
                            OrderId = order.Id,
                            Amount = -clawback,
                            Type = PointTransactionTypeEnum.Redeem,
                            Description = $"Points clawed back for cancelled order {order.Id}"
                        },
                        ct);
                }
            }
        }

        // Free up the coupon use, if one was applied to this order.
        if (!string.IsNullOrWhiteSpace(order.CouponCode))
        {
            var coupon = await dbContext.Coupons.FirstOrDefaultAsync(c => c.Code == order.CouponCode, ct);
            if (coupon != null && coupon.UsedCount > 0)
            {
                coupon.UsedCount--;
            }
        }

        // Mark the payment as refunded if money was actually collected.
        if (order.Payment != null && order.Payment.Status == PaymentStatusEnum.Paid)
        {
            order.Payment.Status = PaymentStatusEnum.Refunded;
        }
    }
}
