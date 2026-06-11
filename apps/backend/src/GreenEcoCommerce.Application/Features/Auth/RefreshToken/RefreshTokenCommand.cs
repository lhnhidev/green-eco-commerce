using GreenEcoCommerce.Application.Interfaces.Caching;
using GreenEcoCommerce.Application.Interfaces.Security;
using GreenEcoCommerce.Domain.Exceptions;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Auth.RefreshToken;

public record RefreshTokenCommand(Guid Id, string RefreshToken) : IRequest<RefreshTokenResponse>;

public class RefreshTokenCommandHanlder(IUserRepository userRepository, ICacheService cacheService, IJwtService jwtService) : IRequestHandler<RefreshTokenCommand, RefreshTokenResponse>
{
    public async Task<RefreshTokenResponse> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        var isLive = await cacheService.IsLiveAsync($"refresh_token:{request.Id}", cancellationToken);

        if (!isLive)
        {
            throw new UnauthorizedAccessException("Refresh token expired or not found");
        }

        var refreshToken = await cacheService.GetAsync<string>($"refresh_token:{request.Id}", cancellationToken);

        if (string.IsNullOrEmpty(refreshToken) || refreshToken != request.RefreshToken)
        {
            throw new UnauthorizedAccessException("Invalid refresh token");
        }

        var user = await userRepository.GetUserByIdAsync(request.Id);

        if (user == null)
        {
            throw new NotFoundException("User not found");
        }

        var newToken = jwtService.GenerateToken(user, minutesExprired : 15);
        var newRefreshToken = jwtService.GenerateRefreshToken();

        await cacheService.SetAsync($"refresh_token:{request.Id}", newRefreshToken, TimeSpan.FromDays(7), cancellationToken);

        var response = new RefreshTokenResponse(newToken, newRefreshToken);

        return response;
    }
}
