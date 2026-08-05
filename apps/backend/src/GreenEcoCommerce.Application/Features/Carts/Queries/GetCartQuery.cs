using GreenEcoCommerce.Application.Interfaces.Configuration;
using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Application.Queries;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Carts.Queries;

public record GetCartQuery(Guid UserId) : IRequest<CartDto>
{
    public class Handler(IApplicationDbContext dbContext, IApplicationConfiguration config) : IRequestHandler<GetCartQuery, CartDto>
    {
        public async Task<CartDto> Handle(GetCartQuery request, CancellationToken ct)
        {
            var cart = await dbContext.Carts.OfUser(request.UserId).ProjectToDto().FirstAsync(ct);
            return await cart.ConfigurePointsSavedAsync(config);
        }
    }
}
