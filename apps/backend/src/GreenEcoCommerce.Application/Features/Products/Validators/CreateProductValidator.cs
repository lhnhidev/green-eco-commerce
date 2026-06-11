using FluentValidation;

namespace GreenEcoCommerce.Application.Features.Products.Validators;

public class CreateProductCommandValidator : AbstractValidator<ProductPayloadDto>
{
    public CreateProductCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Product name is required.")
            .MaximumLength(255).WithMessage("Product name must not exceed 255 characters.");

        RuleFor(x => x.Price)
            .GreaterThan(0).WithMessage("Price must be greater than 0.");

        RuleFor(x => x.StockQty)
            .GreaterThanOrEqualTo(0).WithMessage("Stock quantity cannot be negative.");

        RuleFor(x => x.CategoryId)
            .NotEmpty().WithMessage("Category ID is required.");

        RuleFor(x => x.CarbonIndex)
            .GreaterThan(0).WithMessage("Carbon index must be greater than 0.");

        RuleFor(x => x.DecomposePercent)
            .InclusiveBetween(0, 100).WithMessage("Decompose percent must be between 0 and 100.");

        RuleFor(x => x.RecyclePercent)
            .InclusiveBetween(0, 100).WithMessage("Decompose percent must be between 0 and 100.");

        RuleFor(x => x.BaselineCarbonIndex)
            .GreaterThan(0).WithMessage("Carbon index must be greater than 0.");
    }
}
