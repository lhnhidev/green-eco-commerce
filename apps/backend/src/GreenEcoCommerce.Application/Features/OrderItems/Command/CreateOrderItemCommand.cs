using AutoMapper;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.OrderItems.Command;

public record CreateOrderItemCommand(
    Guid OrderId,
    Guid ProductId,
    int Quantity,
    decimal UnitPrice,
    float UnitCo2Saved
) : IRequest<CreateOrderItemCommandResponse>;

public class CreateOrderItemCommandHandler(IMapper mapper, IOrderItemRepository orderItemRepository) : IRequestHandler<CreateOrderItemCommand, CreateOrderItemCommandResponse>
{
    public async Task<CreateOrderItemCommandResponse> Handle(CreateOrderItemCommand command,
        CancellationToken cancellationToken)
    {
        var orderItem = mapper.Map<OrderItem>(command);

        await orderItemRepository.AddOrderItemAsync(orderItem);

        return mapper.Map<CreateOrderItemCommandResponse>(orderItem);
    }
}
