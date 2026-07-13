using AutoMapper;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Orders.Query;

public record GetAllOrdersQuery : IRequest<List<OrderDto>>;

public class GetAllOrdersQueryHandler(IOrderRepository orderRepository, IMapper mapper) : IRequestHandler<GetAllOrdersQuery, List<OrderDto>>
{
    public async Task<List<OrderDto>> Handle(GetAllOrdersQuery request, CancellationToken cancellationToken)
    {
        var orders = await orderRepository.GetAllOrders(cancellationToken);
        return mapper.Map<List<OrderDto>>(orders);
    }
}
