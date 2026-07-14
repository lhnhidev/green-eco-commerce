using FluentValidation;
using GreenEcoCommerce.Application.Interfaces.Caching;
using GreenEcoCommerce.Application.Interfaces.Security;
using GreenEcoCommerce.Domain.Exceptions;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Auth.Commands;

public record RefreshTokenCommand(Guid Id, string RefreshToken) : IRequest<RefreshTokenCommand.Response>
{
    public record Response(string Token, string RefreshToken);

    public class RefreshTokenCommandHanlder(
        IUserRepository userRepository,
        ICacheService cacheService,
        IJwtService jwtService
    ) : IRequestHandler<RefreshTokenCommand, Response>
    {
        public async Task<Response> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
        {
            bool isLive = await cacheService.IsLiveAsync($"refresh_token:{request.Id}", cancellationToken);

            if (!isLive) { throw new UnauthorizedAccessException("Refresh token expired or not found"); }

            string? refreshToken = await cacheService.GetAsync<string>(
                $"refresh_token:{request.Id}",
                cancellationToken);

            if (string.IsNullOrEmpty(refreshToken) || refreshToken != request.RefreshToken)
            {
                throw new UnauthorizedAccessException("Invalid refresh token");
            }

            var user = await userRepository.GetUserByIdAsync(request.Id);

            if (user == null) { throw new NotFoundException("User not found"); }

            string newToken = jwtService.GenerateToken(user, minutesExprired: 15);
            string newRefreshToken = jwtService.GenerateRefreshToken();

            await cacheService.SetAsync(
                $"refresh_token:{request.Id}",
                newRefreshToken,
                TimeSpan.FromDays(7),
                cancellationToken);

            return new Response(newToken, newRefreshToken);
        }
    }

    public class Validator : AbstractValidator<RefreshTokenCommand>
    {
        public Validator()
        {
            RuleFor(command => command.Id)
                    .NotEmpty().WithMessage("Id is required.")
                    .Must(id => id != Guid.Empty).WithMessage("Id must be a valid GUID.");
        }
    }
}
