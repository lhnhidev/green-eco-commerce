using FluentValidation;
using GreenEcoCommerce.Application.Features.Auth.Register;
using GreenEcoCommerce.Domain.ValueObjects;

namespace GreenEcoCommerce.Application.Features.Auth.Validators;

public class RegisterCommandValidator : AbstractValidator<RegisterCommand>
{
    public RegisterCommandValidator()
    {
        RuleFor(x => x.FirstName).NotEmpty().WithMessage("First name is required.")
            .MinimumLength(2).WithMessage("First name must be at least 2 characters long.")
            .MaximumLength(80).WithMessage("First name must not exceed 80 characters.");

        RuleFor(x => x.LastName).NotEmpty().WithMessage("Last name is required.")
            .MinimumLength(2).WithMessage("Last name must be at least 2 characters long.")
            .MaximumLength(80).WithMessage("Last name must not exceed 80 characters.");

        RuleFor(x => x.Phone).NotEmpty().WithMessage("Phone number is required.")
            .Length(10)
            .WithMessage("Phone number must be exactly 10 digits long.")
            .Must(phoneStr => PhoneNumber.TryFrom(phoneStr, out _))
            .WithMessage("Phone number must be valid.");

        RuleFor(x => x.Address).NotEmpty().WithMessage("Address is required.")
            .MinimumLength(5).WithMessage("Address must be at least 5 characters long.")
            .MaximumLength(500).WithMessage("Address must not exceed 500 characters.");

        RuleFor(x => x.Email).NotEmpty().WithMessage("Email is required.")
            .Must(emailStr => Email.TryFrom(emailStr, out _))
            .WithMessage("Email must be a valid email address.");

        RuleFor(x => x.Password).NotEmpty().WithMessage("Password is required.")
            .MinimumLength(6).WithMessage("Password must be at least 6 characters long.")
            .Matches("[A-Z]").WithMessage("Password must contain at least one uppercase letter.")
            .Matches("[a-z]").WithMessage("Password must contain at least one lowercase letter.")
            .Matches("[0-9]").WithMessage("Password must contain at least one digit.")
            .Matches("[^a-zA-Z0-9]").WithMessage("Password must contain at least one special character.");
    }
}
