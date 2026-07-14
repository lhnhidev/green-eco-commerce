using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Carts.Queries;

public record GetCartQuery(Guid UserId) : IRequest<CartDto>
{
    public class Handler(ICartRepository cartRepository) : IRequestHandler<GetCartQuery, CartDto>
    {
        public async Task<CartDto> Handle(GetCartQuery request, CancellationToken ct)
        {
            var cart = await cartRepository.GetOrCreateByUserIdAsync(request.UserId, ct);
            return cart.ToDto();
        }
    }
}
