using GreenEcoCommerce.Application.Interfaces.Caching;
using GreenEcoCommerce.Application.Interfaces.Security;
using GreenEcoCommerce.Domain.Exceptions;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Auth.Login;

public record LoginCommand(string Email, string Password) : IRequest<LoginResponse>;

public class LoginHandler(IUserRepository userRepository, IJwtService jwtService, ICacheService cacheService)
        : IRequestHandler<LoginCommand, LoginResponse>
{
    public async Task<LoginResponse> Handle(LoginCommand request, CancellationToken ct)
    {
        var user = await userRepository.GetUserByEmailAsync(request.Email);

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            throw new NotFoundException("Not found user, email or password is wrong");
        }

        var token = jwtService.GenerateToken(user, minutesExprired : 15);
        var refreshToken = jwtService.GenerateRefreshToken();

        await cacheService.SetAsync($"refresh_token:{user.Id}", refreshToken, TimeSpan.FromDays(7), ct);

        var userInfo = new UserInfoResponse(
            user.Avatar,
            user.FirstName,
            user.LastName,
            user.Email,
            user.Phone,
            user.Address
        );

        return new LoginResponse(token, refreshToken, userInfo);
    }
}
