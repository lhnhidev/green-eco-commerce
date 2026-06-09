using FluentValidation;
using GreenEcoCommerce.Application.Features.Materials.Commands;
using GreenEcoCommerce.Domain.Enums;

namespace GreenEcoCommerce.Application.Features.Materials.Validators;

public class CreateMaterialCommandValidator : AbstractValidator<CreateMaterialCommand>
{
    public CreateMaterialCommandValidator()
    {
        RuleFor(p => p.Name)
            .NotEmpty().WithMessage("Name is required")
            .MaximumLength(100).WithMessage("Name must not exceed 100 characters");

        RuleFor(p => p.EcoRating)
            .NotEmpty().WithMessage("EcoRating is required")
            .LessThanOrEqualTo(100).WithMessage("EcoRating must be greater than or equal to 100")
            .GreaterThanOrEqualTo(0).WithMessage("EcoRating must be less than or equal to 0");

        RuleFor(p => p.Type)
            .NotEmpty().WithMessage("Type is required")
            .IsEnumName(typeof(MaterialTypeEnum)).WithMessage("Type must be in enum (Natural, Synthetic, Recycled)");
    }
}
