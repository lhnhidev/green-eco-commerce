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

            await OrderCancellationEffects.ReverseAsync(dbContext, order, ct);

            order.Status = OrderStatusEnum.Cancelled;

            await dbContext.Notifications.AddAsync(
                new Notification
                {
                    UserId = order.UserId,
                    Title = "Order cancelled",
                    Message = $"Your order #{order.Id.ToString()[^8..].ToUpperInvariant()} has been cancelled.",
                    Type = NotificationTypeEnum.OrderUpdate,
                    Link = $"/my-orders/{order.Id}",
                    CreatedAt = DateTimeOffset.UtcNow
                },
                ct);

            await dbContext.SaveChangesAsync(ct);
        }
    }
}
