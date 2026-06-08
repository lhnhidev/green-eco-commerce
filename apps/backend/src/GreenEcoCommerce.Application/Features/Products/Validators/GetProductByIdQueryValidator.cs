using FluentValidation;

namespace GreenEcoCommerce.Application.Features.Products.Validators;

public class GetProductByIdQueryValidator : AbstractValidator<GetProductByIdQuery>
{
    public GetProductByIdQueryValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Product ID is required.")
            .Must(id => id != Guid.Empty).WithMessage("Product ID must be a valid GUID.");
    }
}
