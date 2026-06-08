using FluentValidation;

namespace GreenEcoCommerce.Application.Features.Categories.Validators;

public class GetCategoryByIdQueryValidator : AbstractValidator<GetCategoryByIdQuery>
{
    public GetCategoryByIdQueryValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Category ID is required.")
            .Must(id => id != Guid.Empty).WithMessage("Category ID must be a valid GUID.");
    }
}

