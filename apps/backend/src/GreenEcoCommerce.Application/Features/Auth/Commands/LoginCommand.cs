using FluentValidation;
using GreenEcoCommerce.Application.Interfaces.Caching;
using GreenEcoCommerce.Application.Interfaces.Security;
using GreenEcoCommerce.Domain.Exceptions;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Auth.Commands;

public record LoginCommand(string Email, string Password) : IRequest<LoginCommand.Response>
{
    public record Response(string Token, string RefreshToken, UserInfoResponse UserInfo);

    public class LoginHandler(IUserRepository userRepository, IJwtService jwtService, ICacheService cacheService)
            : IRequestHandler<LoginCommand, Response>
    {
        public async Task<Response> Handle(LoginCommand request, CancellationToken ct)
        {
            var user = await userRepository.GetUserByEmailAsync(request.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                throw new NotFoundException("Not found user, email or password is wrong");
            }

            string token = jwtService.GenerateToken(user, minutesExprired: 15);
            string refreshToken = jwtService.GenerateRefreshToken();

            await cacheService.SetAsync($"refresh_token:{user.Id}", refreshToken, TimeSpan.FromDays(7), ct);

            var userInfo = new UserInfoResponse(
                user.Avatar,
                user.FirstName,
                user.LastName,
                user.Email,
                user.Phone,
                user.Address);

            return new Response(token, refreshToken, userInfo);
        }
    }

    public class Validator : AbstractValidator<LoginCommand>
    {
        public Validator()
        {
            RuleFor(x => x.Email).NotEmpty().WithMessage("Email is required.")
                    .Must(emailStr => Domain.ValueObjects.Email.TryFrom(emailStr, out _))
                    .WithMessage("Email must be a valid email address.");

            RuleFor(x => x.Password).NotEmpty().WithMessage("Password is required.");
        }
    }
}

public record UserInfoResponse(
    string Avatar,
    string FirstName,
    string LastName,
    string Email,
    string Phone,
    string Address
);
