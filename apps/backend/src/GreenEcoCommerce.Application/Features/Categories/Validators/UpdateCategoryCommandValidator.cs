using FluentValidation;

namespace GreenEcoCommerce.Application.Features.Categories.Validators;

public class UpdateCategoryCommandValidator : AbstractValidator<UpdateCategoryCommand>
{
    public UpdateCategoryCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Category ID is required.")
            .Must(id => id != Guid.Empty).WithMessage("Category ID must be a valid GUID.");

        RuleFor(x => x.Dto.Name)
            .NotEmpty().WithMessage("Category name is required.")
            .MinimumLength(2).WithMessage("Category name must be at least 2 characters long.")
            .MaximumLength(100).WithMessage("Category name must not exceed 100 characters.");

        RuleFor(x => x.Dto.Description)
            .MaximumLength(500).WithMessage("Description must not exceed 500 characters.")
            .When(x => !string.IsNullOrEmpty(x.Dto.Description));

        RuleFor(x => x.Dto.ParentId)
            .NotNull().WithMessage("Parent ID must be a valid GUID if provided.")
            .When(x => x.Dto.ParentId.HasValue);
    }
}

