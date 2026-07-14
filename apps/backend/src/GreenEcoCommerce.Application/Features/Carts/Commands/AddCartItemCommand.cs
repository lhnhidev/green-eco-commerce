using FluentValidation;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Exceptions;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Carts.Commands;

public record AddCartItemCommand(Guid UserId, Guid ProductId, int Quantity) : IRequest<CartDto>
{
    public class Handler(ICartRepository cartRepository, IProductRepository productRepository)
            : IRequestHandler<AddCartItemCommand, CartDto>
    {
        public async Task<CartDto> Handle(AddCartItemCommand command, CancellationToken ct)
        {
            // Validate product exists
            if (!await productRepository.ProductExistsAsync(command.ProductId, ct))
            {
                throw new NotFoundException($"Product with ID {command.ProductId} not found.");
            }

            var cart = await cartRepository.GetOrCreateByUserIdAsync(command.UserId, ct);

            // Check if item already exists in cart
            var existingItem = await cartRepository.GetCartItemAsync(cart.Id, command.ProductId, ct);

            if (existingItem != null)
            {
                // Update quantity if item already exists
                await cartRepository.UpdateItemQuantityAsync(
                    cart.Id,
                    command.ProductId,
                    existingItem.Quantity + command.Quantity,
                    ct);
            }
            else
            {
                // Add new item
                var cartItem = new CartItem
                {
                    CartId = cart.Id,
                    ProductId = command.ProductId,
                    Quantity = command.Quantity
                };

                await cartRepository.AddItemAsync(cartItem, ct);
            }

            // Re-fetch cart with updated items
            var updatedCart = await cartRepository.GetByUserIdAsync(command.UserId, ct);
            return updatedCart!.ToDto();
        }
    }

    public class Validator : AbstractValidator<AddCartItemCommand>
    {
        public Validator()
        {
            RuleFor(x => x.ProductId)
                    .NotEmpty().WithMessage("Product ID is required.")
                    .Must(id => id != Guid.Empty).WithMessage("Product ID must be a valid GUID.");

            RuleFor(x => x.Quantity).GreaterThan(0).WithMessage("Quantity must be greater than 0.");
            // .LessThanOrEqualTo(100).WithMessage("Quantity must not exceed 100 per item.");
        }
    }
}
