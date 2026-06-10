using FluentValidation;
using GreenEcoCommerce.Application.Features.Auth.RefreshToken;

namespace GreenEcoCommerce.Application.Features.Auth.Validators;

public class RefreshTokenCommandValidator : AbstractValidator<RefreshTokenCommand>
{
    public RefreshTokenCommandValidator()
    {
        RuleFor(command => command.Id)
            .NotEmpty().WithMessage("Id is required.")
            .Must(id => id != Guid.Empty).WithMessage("Id must be a valid GUID.");
    }
}
