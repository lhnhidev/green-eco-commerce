using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Orders.Query;

public record GetAmountAllOrdersQuery : IRequest<int>
{

}

public class GetAmountAllOrdersQueryHandler(IOrderRepository orderRepository) : IRequestHandler<GetAmountAllOrdersQuery, int>
{
    public async Task<int> Handle(GetAmountAllOrdersQuery request, CancellationToken ct)
    {
        var orders = await orderRepository.GetAllOrders(ct);
        return orders.Count;
    }
}
