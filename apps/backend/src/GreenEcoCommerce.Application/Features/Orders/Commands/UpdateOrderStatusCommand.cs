using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Domain.Enums;
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

            order.Status = command.Status;
            await dbContext.SaveChangesAsync(ct);
        }
    }
}
