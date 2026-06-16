using AutoMapper;
using GreenEcoCommerce.Domain.Exceptions;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Carts.Commands;

public record UpdateCartItemCommand(Guid UserId, Guid ProductId, int Quantity) : IRequest<CartDto>;

public class UpdateCartItemHandler(ICartRepository cartRepository, IMapper mapper)
        : IRequestHandler<UpdateCartItemCommand, CartDto>
{
    public async Task<CartDto> Handle(UpdateCartItemCommand command, CancellationToken ct)
    {
        var cart = await cartRepository.GetByUserIdAsync(command.UserId, ct)
            ?? throw new NotFoundException("Cart not found.");

        bool updated = await cartRepository.UpdateItemQuantityAsync(
            cart.Id, command.ProductId, command.Quantity, ct);

        if (!updated)
            throw new NotFoundException($"Cart item with product ID {command.ProductId} not found.");

        // Re-fetch cart with updated items
        var updatedCart = await cartRepository.GetByUserIdAsync(command.UserId, ct);
        return mapper.Map<CartDto>(updatedCart!);
    }
}
