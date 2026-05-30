using FluentValidation;

namespace GreenEcoCommerce.Application.Features.Categories.Validators;

public class CreateCategoryValidator : AbstractValidator<CategoryPayloadDto>
{
    public CreateCategoryValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Category name is required.")
            .MinimumLength(2).WithMessage("Category name must be at least 2 characters long.")
            .MaximumLength(100).WithMessage("Category name must not exceed 100 characters.");

        RuleFor(x => x.Description)
            .MaximumLength(500).WithMessage("Description must not exceed 500 characters.")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.ParentId)
            .NotNull().WithMessage("Parent ID must be a valid GUID if provided.")
            .When(x => x.ParentId.HasValue);
    }
}

