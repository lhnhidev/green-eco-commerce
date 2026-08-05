using FluentValidation;
using GreenEcoCommerce.Application.Interfaces.Configuration;
using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Application.Queries;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Carts.Commands;

public record AddCartItemCommand(Guid UserId, CartItemPayloadDto Item) : IRequest<CartDto>
{
    public class Handler(IApplicationDbContext dbContext, IApplicationConfiguration config)
            : IRequestHandler<AddCartItemCommand, CartDto>
    {
        public async Task<CartDto> Handle(AddCartItemCommand command, CancellationToken ct)
        {
            // Validate product exists
            var product = await dbContext.Products.FirstOrDefaultAsync(p => p.Id == command.Item.ProductId, ct);
            if (product is null)
            {
                throw new NotFoundException($"Product with ID {command.Item.ProductId} not found.");
            }

            // Validate cart exists
            var cart = await dbContext.Carts.OfUser(command.UserId).IncludeCartItems(false).FirstOrDefaultAsync(ct);

            if (cart == null) { throw new NotFoundException("Cart not found."); }

            // Check if item already exists in cart
            var item = cart.CartItems.FirstOrDefault(i => i.ProductId == command.Item.ProductId);

            var newTotalQuantity = (item?.Quantity ?? 0) + command.Item.Quantity;
            if (newTotalQuantity > product.StockQty)
            {
                throw new BadRequestException($"Only {product.StockQty} units of {product.Name} are available in stock.");
            }

            if (item != null)
            {
                // Update quantity if item already exists
                item.Quantity += command.Item.Quantity;
            }
            else
            {
                // Add new item
                var newItem = new CartItem
                {
                    CartId = cart.Id,
                    ProductId = command.Item.ProductId,
                    Quantity = command.Item.Quantity
                };
                await dbContext.CartItems.AddAsync(newItem, ct);
            }

            await dbContext.SaveChangesAsync(ct);

            await dbContext.Carts.Entry(cart).Collection(c => c.CartItems).Query().Include(ci => ci.Product)
                    .LoadAsync(ct);

            return await cart.ToDto().ConfigurePointsSavedAsync(config);
        }
    }

    public class Validator : AbstractValidator<AddCartItemCommand>
    {
        public Validator()
        {
            RuleFor(x => x.Item).SetValidator(new CartItemPayloadDto.Validator());
        }
    }
}
