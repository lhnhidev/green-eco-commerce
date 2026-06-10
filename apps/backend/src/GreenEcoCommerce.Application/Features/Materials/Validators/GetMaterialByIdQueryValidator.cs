using FluentValidation;
using GreenEcoCommerce.Application.Features.Materials.Queries;

namespace GreenEcoCommerce.Application.Features.Materials.Validators;

public class GetMaterialByIdQueryValidator : AbstractValidator<GetMaterialByIdQuery>
{
    public GetMaterialByIdQueryValidator()
    {
        RuleFor(p => p.Id)
            .NotEmpty().WithMessage("Material ID is required.")
            .Must(id => id != Guid.Empty).WithMessage("Material ID cannot be empty.");
    }
}
