using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Enums;
using GreenEcoCommerce.Domain.Exceptions;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Orders.Commands;

public record UpdateOrderStatusCommand(Guid OrderId, OrderStatusEnum Status) : IRequest
{
    public class Handler(IApplicationDbContext dbContext) : IRequestHandler<UpdateOrderStatusCommand>
    {
        public async Task Handle(UpdateOrderStatusCommand command, CancellationToken ct)
        {
            var order = await dbContext.Orders.FindAsync([command.OrderId], ct) ??
                        throw new KeyNotFoundException($"Order with ID {command.OrderId} not found.");

            if (order.Status is OrderStatusEnum.Delivered or OrderStatusEnum.Cancelled && command.Status != order.Status)
            {
                throw new BadRequestException($"Order is already {order.Status} and cannot be changed further.");
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
