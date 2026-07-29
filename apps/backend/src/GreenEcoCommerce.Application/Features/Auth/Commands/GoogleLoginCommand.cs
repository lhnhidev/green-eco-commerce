using FluentValidation;
using GreenEcoCommerce.Application.Features.Profile;
using GreenEcoCommerce.Application.Interfaces.Caching;
using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Application.Interfaces.Security;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Enums;
using GreenEcoCommerce.Domain.Exceptions;
using GreenEcoCommerce.Domain.ValueObjects;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Auth.Commands;

public record GoogleLoginCommand(string IdToken) : IRequest<GoogleLoginCommand.Response>
{
    public record Response(string Token, string RefreshToken, UserProfileDto UserProfile);

    // Google/Facebook profiles don't include a phone number, but PhoneNumber/Address are required
    // on User with no nullable variant — new social-login users get this placeholder and should
    // update it in their profile afterward. Valid against the PhoneNumber value object's VN-format
    // regex; not enforced unique anywhere (no DB constraint on Phone today).
    internal const string PlaceholderPhone = "0900000000";

    public class Handler(
        IApplicationDbContext dbContext,
        ISocialAuthService socialAuthService,
        IJwtService jwtService,
        ICacheService cacheService) : IRequestHandler<GoogleLoginCommand, Response>
    {
        public async Task<Response> Handle(GoogleLoginCommand request, CancellationToken ct)
        {
            var info = await socialAuthService.VerifyGoogleTokenAsync(request.IdToken, ct);

            var user = await dbContext.Users.FirstOrDefaultAsync(u => u.GoogleId == info.ProviderId, ct);

            if (user == null)
            {
                var email = Email.From(info.Email);

                // Link to an existing password account with the same email, if there is one.
                user = await dbContext.Users.FirstOrDefaultAsync(u => u.Email == email, ct);

                if (user != null)
                {
                    user.GoogleId = info.ProviderId;
                }
                else
                {
                    user = new User
                    {
                        Email = email,
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword(Guid.NewGuid().ToString()),
                        FirstName = string.IsNullOrWhiteSpace(info.FirstName) ? "Google" : info.FirstName,
                        LastName = string.IsNullOrWhiteSpace(info.LastName) ? "User" : info.LastName,
                        Phone = PhoneNumber.From(PlaceholderPhone),
                        Address = string.Empty,
                        Avatar = info.AvatarUrl ?? string.Empty,
                        GoogleId = info.ProviderId,
                        Role = RoleEnum.User
                    };

                    await dbContext.Users.AddAsync(user, ct);
                    await dbContext.GreenWallets.AddAsync(new GreenWallet { UserId = user.Id }, ct);
                    await dbContext.Carts.AddAsync(new Cart { UserId = user.Id }, ct);
                }

                await dbContext.SaveChangesAsync(ct);
            }

            if (!user.IsActive)
            {
                throw new BadRequestException("This account has been deactivated.");
            }

            string token = jwtService.GenerateToken(user, minutesExpired: 15);
            string refreshToken = jwtService.GenerateRefreshToken();

            await cacheService.SetAsync($"refresh_token:{user.Id}", refreshToken, TimeSpan.FromDays(7), ct);

            return new Response(token, refreshToken, user.ToProfileDto());
        }
    }

    public class Validator : AbstractValidator<GoogleLoginCommand>
    {
        public Validator()
        {
            RuleFor(x => x.IdToken).NotEmpty().WithMessage("Google ID token is required.");
        }
    }
}
