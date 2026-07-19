using FluentValidation;
using GreenEcoCommerce.Application.Features.Profile;
using GreenEcoCommerce.Application.Interfaces.Caching;
using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Application.Interfaces.Security;
using GreenEcoCommerce.Application.Queries;
using GreenEcoCommerce.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Auth.Commands;

public record LoginCommand(string Email, string Password) : IRequest<LoginCommand.Response>
{
    public record Response(string Token, string RefreshToken, UserProfileDto UserProfile);

    public class Handler(IApplicationDbContext dbContext, IJwtService jwtService, ICacheService cacheService)
            : IRequestHandler<LoginCommand, Response>
    {
        public async Task<Response> Handle(LoginCommand request, CancellationToken ct)
        {
            var user = await dbContext.Users.AsNoTracking().WithEmail(request.Email).FirstOrDefaultAsync(ct);

            if (user == null)
            {
                throw new NotFoundException("User not found.");
            }

            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                throw new BadRequestException("Invalid credentials.");
            }

            string token = jwtService.GenerateToken(user, minutesExpired: 15);
            string refreshToken = jwtService.GenerateRefreshToken();

            await cacheService.SetAsync($"refresh_token:{user.Id}", refreshToken, TimeSpan.FromDays(7), ct);

            var userProfile = user.ToProfileDto();
            return new Response(token, refreshToken, userProfile);
        }
    }

    public class Validator : AbstractValidator<LoginCommand>
    {
        public Validator()
        {
            RuleFor(x => x.Email)
                    .NotEmpty().WithMessage("Email is required.")
                    .Must(emailStr => Domain.ValueObjects.Email.TryFrom(emailStr, out _))
                    .WithMessage("Email must be a valid email address.");

            RuleFor(x => x.Password)
                    .NotEmpty().WithMessage("Password is required.");
        }
    }
}
