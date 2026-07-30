using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using GreenEcoCommerce.Application.Features.Auth.Commands;
using GreenEcoCommerce.Application.Features.Profile;
using GreenEcoCommerce.Application.Features.Profile.Queries;
using GreenEcoCommerce.Application.Features.Users;
using GreenEcoCommerce.Application.Interfaces.Security;
using Microsoft.AspNetCore.Http.HttpResults;

namespace GreenEcoCommerce.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
[ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
public class AuthController(ISender sender, IJwtService jwtService) : ControllerBase
{
    private enum TokenType
    {
        AccessToken,
        RefreshToken
    }

    private static Guid? CheckUserIdClaim(ClaimsPrincipal user)
    {
        var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
        {
            return null;
        }

        return userId;
    }

    private void SetTokenCookie(string token, TokenType type, int daysLive = 7)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true, // Ngăn js/ts truy cập vào token
            Secure = true,   // Bắt buộc dùng HTTPS (ở localhost .NET tự chạy HTTPS)
            SameSite = SameSiteMode.Strict, // Chống tấn công CSRF
            Expires = DateTime.UtcNow.AddDays(daysLive) // Thời gian sống của Cookie
        };

        // Ghi cookie vào Response
        Response.Cookies.Append(type.ToString(), token, cookieOptions);
    }

    [HttpPost("register", Name = nameof(Register))]
    [EndpointDescription("""
                         Đăng ký tài khoản dựa vào thông tin gửi lên. Đăng ký thành công thì gửi về một id của người dùng đã đăng ký

                         ### Dữ liệu gửi lên mẫu:
                         ```json
                         {
                             "firstName": "Nguyễn",
                             "lastName": "Văn A",
                             "phone": "0811125678",
                             "address": "123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh",
                             "role": "User",
                             "email": "annguynnn111@greeneco.com",
                             "password": "SecurePassword123jfdlkjkl!"
                         }
                         ```
                         """)]
    [ProducesResponseType<UserDto>(StatusCodes.Status200OK, Description = "Đăng ký người dùng thành công.")]
    [ProducesResponseType(
        typeof(ProblemDetails),
        StatusCodes.Status400BadRequest,
        Description = "Dữ liệu không hợp lệ. Sai định dạng Email/Phone hoặc thông tin đã tồn tại.")]
    [ProducesResponseType(
        typeof(ProblemDetails),
        StatusCodes.Status500InternalServerError,
        Description = "Lỗi hệ thống.")]
    public async Task<Results<Ok<UserDto>, BadRequest<ProblemDetails>>> Register(RegisterPayload payload)
    {
        var response = await sender.Send(payload.ToUserPayloadDto());
        return TypedResults.Ok(response);
    }

    [HttpPost("login", Name = nameof(Login))]
    public async Task<Results<Ok<UserProfileDto>, BadRequest<ProblemDetails>>> Login(LoginCommand command)
    {
        var response = await sender.Send(command);
        SetTokenCookie(response.Token, TokenType.AccessToken);
        SetTokenCookie(response.RefreshToken, TokenType.RefreshToken);
        return TypedResults.Ok(response.UserProfile);
    }

    [HttpPost("google", Name = nameof(GoogleLogin))]
    public async Task<Results<Ok<UserProfileDto>, BadRequest<ProblemDetails>>> GoogleLogin(GoogleLoginCommand command)
    {
        var response = await sender.Send(command);
        SetTokenCookie(response.Token, TokenType.AccessToken);
        SetTokenCookie(response.RefreshToken, TokenType.RefreshToken);
        return TypedResults.Ok(response.UserProfile);
    }

    [HttpPost("facebook", Name = nameof(FacebookLogin))]
    public async Task<Results<Ok<UserProfileDto>, BadRequest<ProblemDetails>>> FacebookLogin(FacebookLoginCommand command)
    {
        var response = await sender.Send(command);
        SetTokenCookie(response.Token, TokenType.AccessToken);
        SetTokenCookie(response.RefreshToken, TokenType.RefreshToken);
        return TypedResults.Ok(response.UserProfile);
    }

    [HttpPost("logout", Name = nameof(Logout))]
    public async Task<NoContent> Logout()
    {
        string? token = Request.Cookies["AccessToken"];

        if (!string.IsNullOrEmpty(token))
        {
            var claimsPrincipal = jwtService.ValidateToken(token, validateLifetime: false);

            var userId = CheckUserIdClaim(claimsPrincipal);

            if (userId.HasValue)
            {
                await sender.Send(new LogoutCommand(userId.Value));
            }
        }

        Response.Cookies.Delete("AccessToken");
        Response.Cookies.Delete("RefreshToken");

        return TypedResults.NoContent();
    }

    [HttpGet("me", Name = nameof(GetMe))]
    [Authorize]
    public async Task<Results<Ok<UserProfileDto>, NotFound, BadRequest<ProblemDetails>>> GetMe()
    {
        var userId = CheckUserIdClaim(User);
        if (!userId.HasValue)
        {
            return TypedResults.BadRequest(new ProblemDetails
            {
                Title = "Invalid User",
                Detail = "Invalid user ID in token"
            });
        }

        var response = await sender.Send(new GetUserProfileQuery(userId.Value));
        return response != null ? TypedResults.Ok(response) : TypedResults.NotFound();
    }

    [HttpPost("refresh-token", Name = nameof(RefreshToken))]
    public async Task<Results<NoContent, BadRequest<ProblemDetails>>> RefreshToken()
    {
        string? expiredToken = Request.Cookies["AccessToken"];
        string? refreshToken = Request.Cookies["RefreshToken"];

        foreach ((string key, string value) in Request.Cookies)
        {
            Console.WriteLine($"Key: {key} | Value: {value}");
        }

        if (string.IsNullOrEmpty(expiredToken) || string.IsNullOrEmpty(refreshToken))
        {
            return TypedResults.BadRequest(new ProblemDetails
            {
                Title = "Invalid Token",
                Detail = "Invalid access token or refresh token"
            });
        }

        try
        {
            var claimsPrincipal = jwtService.ValidateToken(expiredToken, validateLifetime: false);
            var userId = CheckUserIdClaim(claimsPrincipal);

            if (!userId.HasValue)
            {
                return TypedResults.BadRequest(new ProblemDetails
                {
                    Title = "Invalid User",
                    Detail = "Invalid user ID in token"
                });
            }

            var result = await sender.Send(new RefreshTokenCommand(userId.Value, refreshToken));
            SetTokenCookie(result.Token, TokenType.AccessToken);
            SetTokenCookie(result.RefreshToken, TokenType.RefreshToken);

            return TypedResults.NoContent();
        }
        catch (UnauthorizedAccessException)
        {
            return TypedResults.BadRequest(new ProblemDetails
            {
                Title = "Invalid Token",
                Detail = "Invalid access token or refresh token"
            });
        }
    }
}
