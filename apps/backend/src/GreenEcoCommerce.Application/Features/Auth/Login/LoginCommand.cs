using FluentValidation;
using GreenEcoCommerce.Application.Interfaces.Security;
using GreenEcoCommerce.Domain.Exceptions;
using GreenEcoCommerce.Domain.Interfaces;
using GreenEcoCommerce.Domain.ValueObjects;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Auth.Login;

public record LoginCommand(string Email, string Password) : IRequest<string>;

public class LoginHandler(IUserRepository userRepository, IJwtService jwtService)
        : IRequestHandler<LoginCommand, string>
{
    public async Task<string> Handle(LoginCommand request, CancellationToken ct)
    {
        var user = await userRepository.GetUserByEmailAsync(request.Email);

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            throw new NotFoundException("Not found user, email or password is wrong");
        }

        return jwtService.GenerateToken(user);
    }
}

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
