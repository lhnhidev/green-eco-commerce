using FluentValidation;
using GreenEcoCommerce.Application.Features.Materials.Commands;

namespace GreenEcoCommerce.Application.Features.Materials.Validators;

public class DeleteMaterialCommandValidator : AbstractValidator<DeleteMaterialCommand>
{
    public DeleteMaterialCommandValidator()
    {
        RuleFor(command => command.Id)
            .NotEmpty().WithMessage("Material id is required")
            .Must(id => id != Guid.Empty).WithMessage("Material id cannot be empty");
    }
}
