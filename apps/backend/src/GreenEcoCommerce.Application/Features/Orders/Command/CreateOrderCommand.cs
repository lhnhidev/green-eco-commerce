using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Orders.Command;

public record CreateOrderCommand(Guid UserId, string DeliveryAddress, decimal DiscountAmount, decimal EarnedPoints)
        : IRequest<OrderDto>
{
    public class Handler(IOrderRepository orderRepository) : IRequestHandler<CreateOrderCommand, OrderDto>
    {
        public async Task<OrderDto> Handle(CreateOrderCommand command, CancellationToken ct)
        {
            var order = command.ToEntity();

            await orderRepository.AddOrderAsync(order, ct);

            return order.ToDto();
        }
    }
}
