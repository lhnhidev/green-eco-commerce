using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.OrderItems.Query;

public record GetTotalCo2SavedQuery : IRequest<float>
{
    public class Handler(IOrderItemRepository orderItemRepository) : IRequestHandler<GetTotalCo2SavedQuery, float>
    {
        public async Task<float> Handle(GetTotalCo2SavedQuery request, CancellationToken ct)
        {
            var orderItems = await orderItemRepository.GetAllOrdersAsync(ct);
            return orderItems.Sum(oi => oi.UnitCo2Saved * oi.Quantity);
        }
    }
}
