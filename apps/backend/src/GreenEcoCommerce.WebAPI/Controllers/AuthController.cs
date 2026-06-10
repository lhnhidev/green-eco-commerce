using System.IdentityModel.Tokens.Jwt;
using GreenEcoCommerce.Application.Features.Auth.GetMe;
using GreenEcoCommerce.Application.Features.Auth.Login;
using GreenEcoCommerce.Application.Features.Auth.Register;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using GreenEcoCommerce.Application.Features.Auth.Logout;
using GreenEcoCommerce.Application.Features.Auth.RefreshToken;
using GreenEcoCommerce.Application.Interfaces.Security;
using Microsoft.IdentityModel.Tokens;

namespace GreenEcoCommerce.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
[ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
[ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
public class AuthController(ISender sender, IJwtService jwtService) : ControllerBase
{
    private enum TokenType
    {
        AccessToken,
        RefreshToken
    }

    // minutes
    private readonly int timeExpireAccessToken = 15; // 15 minuts
    private readonly int timeExpireRefreshToken = 7 * 24 * 60; // 7 days

    private static Guid CheckUserIdClaim(ClaimsPrincipal user)
    {
        var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
        {
            throw new UnauthorizedAccessException("Invalid user ID in token");
        }

        return userId;
    }

    private void SetToken(string token, TokenType type, int minutesLive = 15)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true, // Ngăn js/ts truy cập vào token
            Secure = true,   // Bắt buộc dùng HTTPS (ở localhost .NET tự chạy HTTPS)
            SameSite = SameSiteMode.Strict, // Chống tấn công CSRF
            Expires = DateTime.UtcNow.AddMinutes(minutesLive) // Thời gian sống của Cookie
        };

        // Ghi cookie vào Response
        Response.Cookies.Append(type.ToString(), token, cookieOptions);
    }

    [HttpPost("register")]
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
    [ProducesResponseType<RegisterResponse>(StatusCodes.Status200OK, Description = "Đăng ký người dùng thành công.")]
    [ProducesResponseType(
        typeof(ProblemDetails),
        StatusCodes.Status400BadRequest,
        Description = "Dữ liệu không hợp lệ. Sai định dạng Email/Phone hoặc thông tin đã tồn tại.")]
    [ProducesResponseType(
        typeof(ProblemDetails),
        StatusCodes.Status500InternalServerError,
        Description = "Lỗi hệ thống.")]
    public async Task<IActionResult> Register(RegisterCommand command)
    {
        var response = await sender.Send(command);
        return Ok(response);
    }

    [HttpPost("login")]
    [ProducesResponseType<UserInfoResponse>(StatusCodes.Status200OK)]
    public async Task<IActionResult> Login(LoginCommand command)
    {
        var response = await sender.Send(command);
        SetToken(response.Token, TokenType.AccessToken, timeExpireAccessToken);
        SetToken(response.RefreshToken, TokenType.RefreshToken, timeExpireRefreshToken);
        return Ok(response.UserInfo);
    }

    [HttpPost("logout")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Logout()
    {
        var userId = CheckUserIdClaim(User);
        await sender.Send(new LogoutCommand(userId));

        Response.Cookies.Delete("AccessToken");
        Response.Cookies.Delete("RefreshToken");

        return NoContent();
    }

    [HttpGet("me")]
    [Authorize]
    [ProducesResponseType<UserProfileResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetMe()
    {
        var userId = CheckUserIdClaim(User);
        var response = await sender.Send(new GetMeQuery(userId));
        return Ok(response);
    }

    [HttpPost("refresh-token")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> RefreshToken()
    {
        var expiredToken = Request.Cookies["AccessToken"];
        var refreshToken = Request.Cookies["RefreshToken"];

        if (string.IsNullOrEmpty(expiredToken) || string.IsNullOrEmpty(refreshToken))
        {
            return Unauthorized("Invalid access token or refresh token");
        }

        try
        {
            var claimsPrincipal = jwtService.ValidateToken(expiredToken, validateLifetime: false);
            var userId = CheckUserIdClaim(claimsPrincipal);

            var result = await sender.Send(new RefreshTokenCommand(userId, refreshToken));
            SetToken(result.Token, TokenType.AccessToken, timeExpireAccessToken);
            SetToken(result.RefreshToken, TokenType.RefreshToken, timeExpireRefreshToken);

            return Ok();
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized("Invalid token");
        }
    }
}
