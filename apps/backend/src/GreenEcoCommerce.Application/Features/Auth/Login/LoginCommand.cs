using FluentValidation;
using GreenEcoCommerce.Application.Interfaces.Caching;
using GreenEcoCommerce.Application.Interfaces.Security;
using GreenEcoCommerce.Domain.Exceptions;
using GreenEcoCommerce.Domain.Interfaces;
using GreenEcoCommerce.Domain.ValueObjects;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Auth.Login;

public record LoginCommand(string Email, string Password) : IRequest<string>;

public class LoginHandler(IUserRepository userRepository, IJwtService jwtService, ICacheService cacheService)
        : IRequestHandler<LoginCommand, string>
{
    public async Task<string> Handle(LoginCommand request, CancellationToken ct)
    {
        var user = await userRepository.GetUserByEmailAsync(request.Email);

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            throw new NotFoundException("Not found user, email or password is wrong");
        }

        var token = jwtService.GenerateToken(user);
        var refreshToken = jwtService.GenerateRefreshToken();

        await cacheService.SetAsync($"refresh_token:{user.Id}", refreshToken, TimeSpan.FromDays(7), ct);

        return token;
    }
}
