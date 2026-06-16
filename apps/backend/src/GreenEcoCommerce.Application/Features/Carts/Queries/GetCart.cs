using AutoMapper;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Carts.Queries;

public record GetCartQuery(Guid UserId) : IRequest<CartDto>;

public class GetCartHandler(ICartRepository cartRepository, IMapper mapper)
        : IRequestHandler<GetCartQuery, CartDto>
{
    public async Task<CartDto> Handle(GetCartQuery request, CancellationToken ct)
    {
        var cart = await cartRepository.GetOrCreateByUserIdAsync(request.UserId, ct);
        return mapper.Map<CartDto>(cart);
    }
}
