using FluentValidation;
using GreenEcoCommerce.Application.Interfaces.Configuration;
using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Application.Queries;
using GreenEcoCommerce.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Carts.Commands;

public record UpdateCartItemCommand(Guid UserId, CartItemPayloadDto Item) : IRequest<CartDto>
{
    public class Handler(IApplicationDbContext dbContext, IApplicationConfiguration config)
            : IRequestHandler<UpdateCartItemCommand, CartDto>
    {
        public async Task<CartDto> Handle(UpdateCartItemCommand command, CancellationToken ct)
        {
            // Validate product exists
            if (!await dbContext.Products.AnyAsync(p => p.Id == command.Item.ProductId, ct))
            {
                throw new NotFoundException($"Product with ID {command.Item.ProductId} not found.");
            }

            // Validate cart exists
            var cart = await dbContext.Carts.OfUser(command.UserId).IncludeCartItems(false).FirstOrDefaultAsync(ct);

            if (cart == null) { throw new NotFoundException("Cart not found."); }

            // Check if item already exists in cart
            var item = cart.CartItems.FirstOrDefault(i => i.ProductId == command.Item.ProductId);

            if (item != null) { item.Quantity = command.Item.Quantity; }
            else { throw new NotFoundException($"Cart item with product ID {command.Item.ProductId} not found."); }

            await dbContext.SaveChangesAsync(ct);

            await dbContext.Carts.Entry(cart).Collection(c => c.CartItems).Query().Include(ci => ci.Product)
                    .LoadAsync(ct);

            return await cart.ToDto().ConfigurePointsSavedAsync(config);
        }
    }

    public class Validator : AbstractValidator<UpdateCartItemCommand>
    {
        public Validator()
        {
            RuleFor(x => x.Item).SetValidator(new CartItemPayloadDto.Validator());
        }
    }
}
