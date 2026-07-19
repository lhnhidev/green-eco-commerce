using FluentValidation;
using GreenEcoCommerce.Application.Interfaces.Caching;
using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Application.Interfaces.Security;
using GreenEcoCommerce.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Auth.Commands;

public record RefreshTokenCommand(Guid Id, string RefreshToken) : IRequest<RefreshTokenCommand.Response>
{
    public record Response(string Token, string RefreshToken);

    public class Handler(IApplicationDbContext dbContext, ICacheService cacheService, IJwtService jwtService)
            : IRequestHandler<RefreshTokenCommand, Response>
    {
        public async Task<Response> Handle(RefreshTokenCommand request, CancellationToken ct)
        {
            bool isLive = await cacheService.IsLiveAsync($"refresh_token:{request.Id}", ct);

            if (!isLive) { throw new UnauthorizedAccessException("Refresh token expired or not found"); }

            string? refreshToken = await cacheService.GetAsync<string>($"refresh_token:{request.Id}", ct);

            if (string.IsNullOrEmpty(refreshToken) || refreshToken != request.RefreshToken)
            {
                throw new UnauthorizedAccessException("Invalid refresh token");
            }

            var user = await dbContext.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == request.Id, ct);

            if (user == null) { throw new NotFoundException("User not found"); }

            string newToken = jwtService.GenerateToken(user, minutesExpired: 15);
            string newRefreshToken = jwtService.GenerateRefreshToken();

            await cacheService.SetAsync($"refresh_token:{request.Id}", newRefreshToken, TimeSpan.FromDays(7), ct);

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
