using AutoMapper;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Exceptions;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Carts.Commands;

public record AddCartItemCommand(Guid UserId, Guid ProductId, int Quantity) : IRequest<CartDto>;

public class AddCartItemHandler(
    ICartRepository cartRepository,
    IProductRepository productRepository,
    IMapper mapper)
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
                cart.Id, command.ProductId, existingItem.Quantity + command.Quantity, ct);
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
        return mapper.Map<CartDto>(updatedCart!);
    }
}
