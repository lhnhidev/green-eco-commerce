using AutoMapper;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Orders.Command;

public record CreateOrderCommand(Guid UserId, string DeliveryAddress, decimal DiscountAmount, decimal EarnedPoints) : IRequest<CreateOrderCommandResponse>;

public class CreateOrderCommandHanlder(IOrderRepository orderRepository, IMapper mapper) : IRequestHandler<CreateOrderCommand, CreateOrderCommandResponse>
{
    public async Task<CreateOrderCommandResponse> Handle(CreateOrderCommand command, CancellationToken cancellationToken)
    {
        var order = mapper.Map<Order>(command);

        await orderRepository.AddOrderAsync(order);

        return mapper.Map<CreateOrderCommandResponse>(order);
    }
}
