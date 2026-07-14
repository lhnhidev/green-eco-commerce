using FluentValidation;
using GreenEcoCommerce.Domain.Exceptions;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Carts.Commands;

public record UpdateCartItemCommand(Guid UserId, Guid ProductId, int Quantity) : IRequest<CartDto>
{
    public class Handler(ICartRepository cartRepository) : IRequestHandler<UpdateCartItemCommand, CartDto>
    {
        public async Task<CartDto> Handle(UpdateCartItemCommand command, CancellationToken ct)
        {
            var cart = await cartRepository.GetByUserIdAsync(command.UserId, ct) ??
                       throw new NotFoundException("Cart not found.");

            bool updated = await cartRepository.UpdateItemQuantityAsync(
                cart.Id,
                command.ProductId,
                command.Quantity,
                ct);

            if (!updated) throw new NotFoundException($"Cart item with product ID {command.ProductId} not found.");

            // Re-fetch cart with updated items
            var updatedCart = await cartRepository.GetByUserIdAsync(command.UserId, ct);
            return updatedCart!.ToDto();
        }
    }

    public class Validator : AbstractValidator<UpdateCartItemCommand>
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
