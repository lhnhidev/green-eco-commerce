using System.Net.Http.Json;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json.Serialization;
using Google.Apis.Auth;
using GreenEcoCommerce.Application.Interfaces.Security;
using GreenEcoCommerce.Domain.Exceptions;
using Microsoft.Extensions.Configuration;

namespace GreenEcoCommerce.Infrastructure.Identity;

public class SocialAuthService(IConfiguration configuration, IHttpClientFactory httpClientFactory) : ISocialAuthService
{
    public async Task<SocialUserInfo> VerifyGoogleTokenAsync(string idToken, CancellationToken ct = default)
    {
        GoogleJsonWebSignature.Payload payload;
        try
        {
            payload = await GoogleJsonWebSignature.ValidateAsync(
                idToken,
                new GoogleJsonWebSignature.ValidationSettings
                {
                    Audience = [configuration["Google:ClientId"] ?? string.Empty]
                });
        }
        catch (InvalidJwtException)
        {
            throw new BadRequestException("Invalid Google sign-in token.");
        }

        return new SocialUserInfo(payload.Subject, payload.Email, payload.GivenName, payload.FamilyName, payload.Picture);
    }

    public async Task<SocialUserInfo> VerifyFacebookTokenAsync(string accessToken, CancellationToken ct = default)
    {
        string appSecret = configuration["Facebook:AppSecret"] ?? string.Empty;
        string proof = ComputeAppSecretProof(accessToken, appSecret);

        var client = httpClientFactory.CreateClient();
        string url = "https://graph.facebook.com/me" +
                     "?fields=id,email,first_name,last_name,picture" +
                     $"&access_token={Uri.EscapeDataString(accessToken)}" +
                     $"&appsecret_proof={proof}";

        FacebookProfile? profile;
        try
        {
            profile = await client.GetFromJsonAsync<FacebookProfile>(url, ct);
        }
        catch (HttpRequestException)
        {
            throw new BadRequestException("Invalid Facebook sign-in token.");
        }

        if (profile == null || string.IsNullOrWhiteSpace(profile.Email))
        {
            throw new BadRequestException(
                "Could not read your Facebook profile. Make sure you granted access to your email.");
        }

        return new SocialUserInfo(profile.Id, profile.Email, profile.FirstName, profile.LastName, profile.Picture?.Data?.Url);
    }

    private static string ComputeAppSecretProof(string accessToken, string appSecret)
    {
        byte[] keyBytes = Encoding.UTF8.GetBytes(appSecret);
        byte[] messageBytes = Encoding.UTF8.GetBytes(accessToken);
        byte[] hash = HMACSHA256.HashData(keyBytes, messageBytes);
        return Convert.ToHexStringLower(hash);
    }

    private record PictureData([property: JsonPropertyName("url")] string? Url);

    private record Picture([property: JsonPropertyName("data")] PictureData? Data);

    private record FacebookProfile(
        [property: JsonPropertyName("id")] string Id,
        [property: JsonPropertyName("email")] string? Email,
        [property: JsonPropertyName("first_name")] string? FirstName,
        [property: JsonPropertyName("last_name")] string? LastName,
        [property: JsonPropertyName("picture")] Picture? Picture);
}
