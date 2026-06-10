using FluentValidation;
using GreenEcoCommerce.Application.Features.Materials.Commands;
using GreenEcoCommerce.Domain.Enums;

namespace GreenEcoCommerce.Application.Features.Materials.Validators;

public class UpdateMaterialCommandValidator : AbstractValidator<UpdateMaterialCommand>
{
    public UpdateMaterialCommandValidator()
    {
        RuleFor(c => c.Id)
            .NotEmpty().WithMessage("Material id is required")
            .Must(id => id != Guid.Empty).WithMessage("Material id cannot be empty");

        RuleFor(c => c.Dto.Name)
            .NotEmpty().WithMessage("Material name is required")
            .MaximumLength(300).WithMessage("Material name cannot exceed 180 characters")
            .MinimumLength(2).WithMessage("Material name cannot exceed 3 characters");

        RuleFor(c => c.Dto.Type)
            .NotEmpty().WithMessage("Material type is required")
            .IsEnumName(typeof(MaterialTypeEnum)).WithMessage("Type must be in enum (Natural, Synthetic, Recycled)");

        RuleFor(c => c.Dto.EcoRating)
            .NotNull().WithMessage("EcoRating is required")
            .GreaterThanOrEqualTo(1).WithMessage("EcoRating must be greater than or equal to 1")
            .LessThanOrEqualTo(100).WithMessage("EcoRating must be less than or equal to 100");
    }
}
