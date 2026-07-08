using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.OrderItems.Query;

public record GetTotalCo2SavedQuery : IRequest<float>;

public class GetTotalCo2SavedQueryHandler(IOrderItemRepository orderItemRepository) : IRequestHandler<GetTotalCo2SavedQuery, float>
{
    public async Task<float> Handle(GetTotalCo2SavedQuery request, CancellationToken cancellationToken)
    {
        var orderItems = await orderItemRepository.GetAllOrdersAsync();
        return orderItems.Sum(oi => oi.UnitCo2Saved * oi.Quantity);
    }
}
