namespace GreenEcoCommerce.Application.Interfaces.Security;

public record SocialUserInfo(string ProviderId, string Email, string? FirstName, string? LastName, string? AvatarUrl);

public interface ISocialAuthService
{
    Task<SocialUserInfo> VerifyGoogleTokenAsync(string idToken, CancellationToken ct = default);
    Task<SocialUserInfo> VerifyFacebookTokenAsync(string accessToken, CancellationToken ct = default);
}
