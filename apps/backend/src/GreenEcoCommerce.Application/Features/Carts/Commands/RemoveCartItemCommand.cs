using GreenEcoCommerce.Application.Interfaces.Configuration;
using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Application.Queries;
using GreenEcoCommerce.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Carts.Commands;

public record RemoveCartItemCommand(Guid UserId, Guid ProductId) : IRequest<CartDto>
{
    public class Handler(IApplicationDbContext dbContext, IApplicationConfiguration config)
            : IRequestHandler<RemoveCartItemCommand, CartDto>
    {
        public async Task<CartDto> Handle(RemoveCartItemCommand command, CancellationToken ct)
        {
            var cart = await dbContext.Carts.OfUser(command.UserId).FirstOrDefaultAsync(ct);
            if (cart == null) throw new NotFoundException("Cart not found.");

            var item = cart.CartItems.FirstOrDefault(i => i.ProductId == command.ProductId);

            if (item != null)
            {
                cart.CartItems.Remove(item);
                await dbContext.SaveChangesAsync(ct);
            }

            return await cart.ToDto().ConfigurePointsSavedAsync(config);
        }
    }
}
