using AutoMapper;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Carts.Queries;

public record GetSomeCarts(Guid UserId, int PageNumber, int Amount) : IRequest<CartDto>;

public class GetSomeCartsHandler(ICartRepository cartRepository, IMapper mapper)
    : IRequestHandler<GetSomeCarts, CartDto>
{
    public Task<CartDto> Handle(GetSomeCarts request, CancellationToken cancellationToken) => throw new NotImplementedException();
}
