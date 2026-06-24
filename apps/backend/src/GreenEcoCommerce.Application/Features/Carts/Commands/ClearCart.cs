using GreenEcoCommerce.Domain.Exceptions;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Carts.Commands;

public record ClearCartCommand(Guid UserId) : IRequest<Unit>;

public class ClearCartHandler(ICartRepository cartRepository)
        : IRequestHandler<ClearCartCommand, Unit>
{
    public async Task<Unit> Handle(ClearCartCommand command, CancellationToken ct)
    {
        var cart = await cartRepository.GetByUserIdAsync(command.UserId, ct)
            ?? throw new NotFoundException("Cart not found.");

        await cartRepository.ClearCartAsync(cart.Id, ct);

        return Unit.Value;
    }
}
