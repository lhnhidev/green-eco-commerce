using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.OrderItems.Commands;

public record CreateOrderItemCommand(Guid OrderId, Guid ProductId, int Quantity, decimal UnitPrice, float UnitCo2Saved)
        : IRequest<CreateOrderItemCommandResponse>
{
    public class Handler(IOrderItemRepository orderItemRepository)
            : IRequestHandler<CreateOrderItemCommand, CreateOrderItemCommandResponse>
    {
        public async Task<CreateOrderItemCommandResponse> Handle(CreateOrderItemCommand command, CancellationToken ct)
        {
            var orderItem = command.ToEntity();

            await orderItemRepository.AddOrderItemAsync(orderItem, ct);

            return orderItem.ToDto();
        }
    }
}
