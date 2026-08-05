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

public record FacebookLoginCommand(string AccessToken) : IRequest<FacebookLoginCommand.Response>
{
    public record Response(string Token, string RefreshToken, UserProfileDto UserProfile);

    public class Handler(
        IApplicationDbContext dbContext,
        ISocialAuthService socialAuthService,
        IJwtService jwtService,
        ICacheService cacheService) : IRequestHandler<FacebookLoginCommand, Response>
    {
        public async Task<Response> Handle(FacebookLoginCommand request, CancellationToken ct)
        {
            var info = await socialAuthService.VerifyFacebookTokenAsync(request.AccessToken, ct);

            var user = await dbContext.Users.FirstOrDefaultAsync(u => u.FacebookId == info.ProviderId, ct);

            if (user == null)
            {
                var email = Email.From(info.Email);

                // Link to an existing password account with the same email, if there is one.
                user = await dbContext.Users.FirstOrDefaultAsync(u => u.Email == email, ct);

                if (user != null)
                {
                    user.FacebookId = info.ProviderId;
                }
                else
                {
                    user = new User
                    {
                        Email = email,
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword(Guid.NewGuid().ToString()),
                        FirstName = string.IsNullOrWhiteSpace(info.FirstName) ? "Facebook" : info.FirstName,
                        LastName = string.IsNullOrWhiteSpace(info.LastName) ? "User" : info.LastName,
                        Phone = PhoneNumber.From(GoogleLoginCommand.PlaceholderPhone),
                        Address = string.Empty,
                        Avatar = info.AvatarUrl ?? string.Empty,
                        FacebookId = info.ProviderId,
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

    public class Validator : AbstractValidator<FacebookLoginCommand>
    {
        public Validator()
        {
            RuleFor(x => x.AccessToken).NotEmpty().WithMessage("Facebook access token is required.");
        }
    }
}
