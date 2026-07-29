using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Application.Queries;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Orders.Commands;

public record CancelOrderCommand(Guid OrderId, Guid UserId) : IRequest
{
    public class Handler(IApplicationDbContext dbContext) : IRequestHandler<CancelOrderCommand>
    {
        public async Task Handle(CancelOrderCommand command, CancellationToken ct)
        {
            var order = await dbContext.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .Include(o => o.Payment)
                .FirstOrDefaultAsync(o => o.Id == command.OrderId, ct)
                ?? throw new KeyNotFoundException($"Order with ID {command.OrderId} not found.");

            if (order.UserId != command.UserId)
                throw new UnauthorizedAccessException("You are not allowed to cancel this order.");

            if (order.Status != OrderStatusEnum.Pending)
                throw new InvalidOperationException("Only Pending orders can be cancelled.");

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
                    int refund = (int)Math.Round(-order.EarnedPoints);
                    await dbContext.DepositWalletAsync(wallet, refund, $"Refund for cancelled order {order.Id}", order.Id, ct);
                }
                else
                {
                    // Claw back points earned from this order, clamped to what's still available
                    // (the user may have already spent some of it elsewhere).
                    int clawback = Math.Min(wallet.Balance, (int)Math.Round(order.EarnedPoints));
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

            order.Status = OrderStatusEnum.Cancelled;

            await dbContext.Notifications.AddAsync(
                new Notification
                {
                    UserId = order.UserId,
                    Title = "Order cancelled",
                    Message = $"Your order #{order.Id.ToString()[..8].ToUpperInvariant()} has been cancelled.",
                    Type = NotificationTypeEnum.OrderUpdate,
                    Link = $"/my-orders/{order.Id}",
                    CreatedAt = DateTimeOffset.UtcNow
                },
                ct);

            await dbContext.SaveChangesAsync(ct);
        }
    }
}
