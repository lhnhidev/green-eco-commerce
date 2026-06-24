using AutoMapper;
using GreenEcoCommerce.Domain.Exceptions;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Carts.Commands;

public record RemoveCartItemCommand(Guid UserId, Guid ProductId) : IRequest<CartDto>;

public class RemoveCartItemHandler(ICartRepository cartRepository, IMapper mapper)
        : IRequestHandler<RemoveCartItemCommand, CartDto>
{
    public async Task<CartDto> Handle(RemoveCartItemCommand command, CancellationToken ct)
    {
        var cart = await cartRepository.GetByUserIdAsync(command.UserId, ct)
            ?? throw new NotFoundException("Cart not found.");

        bool removed = await cartRepository.RemoveItemAsync(cart.Id, command.ProductId, ct);

        if (!removed)
            throw new NotFoundException($"Cart item with product ID {command.ProductId} not found.");

        // Re-fetch cart with updated items
        var updatedCart = await cartRepository.GetByUserIdAsync(command.UserId, ct);
        return mapper.Map<CartDto>(updatedCart!);
    }
}
