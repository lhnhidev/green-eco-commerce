using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Orders.Queries;

public record GetAllOrdersQuery : IRequest<OrderDto[]>;

public class GetAllOrdersQueryHandler(IOrderRepository orderRepository)
        : IRequestHandler<GetAllOrdersQuery, OrderDto[]>
{
    public async Task<OrderDto[]> Handle(GetAllOrdersQuery request, CancellationToken ct)
    {
        var orders = await orderRepository.GetAllOrders(ct);
        return orders.Select(OrderDtoMapper.ToDto).ToArray();
    }
}
