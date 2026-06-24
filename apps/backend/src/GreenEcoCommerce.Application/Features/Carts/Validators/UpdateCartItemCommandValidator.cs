using FluentValidation;
using GreenEcoCommerce.Application.Features.Carts.Commands;

namespace GreenEcoCommerce.Application.Features.Carts.Validators;

public class UpdateCartItemCommandValidator : AbstractValidator<UpdateCartItemCommand>
{
    public UpdateCartItemCommandValidator()
    {
        RuleFor(x => x.ProductId)
            .NotEmpty().WithMessage("Product ID is required.")
            .Must(id => id != Guid.Empty).WithMessage("Product ID must be a valid GUID.");

        RuleFor(x => x.Quantity).GreaterThan(0).WithMessage("Quantity must be greater than 0.");
        // .LessThanOrEqualTo(100).WithMessage("Quantity must not exceed 100 per item.");
    }
}
