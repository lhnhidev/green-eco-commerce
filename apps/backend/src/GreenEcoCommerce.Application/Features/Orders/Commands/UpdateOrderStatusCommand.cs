using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Enums;
using GreenEcoCommerce.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Orders.Commands;

public record UpdateOrderStatusCommand(Guid OrderId, OrderStatusEnum Status) : IRequest
{
    public class Handler(IApplicationDbContext dbContext) : IRequestHandler<UpdateOrderStatusCommand>
    {
        public async Task Handle(UpdateOrderStatusCommand command, CancellationToken ct)
        {
            var order = await dbContext.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .Include(o => o.Payment)
                .FirstOrDefaultAsync(o => o.Id == command.OrderId, ct)
                ?? throw new KeyNotFoundException($"Order with ID {command.OrderId} not found.");

            if (order.Status is OrderStatusEnum.Delivered or OrderStatusEnum.Cancelled && command.Status != order.Status)
            {
                throw new BadRequestException($"Order is already {order.Status} and cannot be changed further.");
            }

            // Cancelling from the admin dropdown must reverse stock/points/coupon/payment
            // exactly like the user's self-service CancelOrderCommand does, otherwise this
            // path silently leaves stock and Green Wallet balances wrong.
            if (command.Status == OrderStatusEnum.Cancelled && order.Status != OrderStatusEnum.Cancelled)
            {
                await OrderCancellationEffects.ReverseAsync(dbContext, order, ct);
            }

            order.Status = command.Status;

            await dbContext.Notifications.AddAsync(
                new Notification
                {
                    UserId = order.UserId,
                    Title = "Order status updated",
                    Message = $"Your order #{order.Id.ToString()[^8..].ToUpperInvariant()} is now {command.Status}.",
                    Type = NotificationTypeEnum.OrderUpdate,
                    Link = $"/my-orders/{order.Id}",
                    CreatedAt = DateTimeOffset.UtcNow
                },
                ct);

            await dbContext.SaveChangesAsync(ct);
        }
    }
}
