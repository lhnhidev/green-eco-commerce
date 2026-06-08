using FluentValidation;
using GreenEcoCommerce.Application.Features.Auth.Login;
using GreenEcoCommerce.Domain.ValueObjects;

namespace GreenEcoCommerce.Application.Features.Auth.Validators;

public class LoginCommandValidator : AbstractValidator<LoginCommand>
{
    public LoginCommandValidator()
    {
        RuleFor(x => x.Email).NotEmpty().WithMessage("Email is required.")
            .Must(emailStr => Email.TryFrom(emailStr, out _))
            .WithMessage("Email must be a valid email address.");

        RuleFor(x => x.Password).NotEmpty().WithMessage("Password is required.");
    }
}
