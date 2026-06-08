using GreenEcoCommerce.Application.Features.Auth.GetMe;
using GreenEcoCommerce.Application.Features.Auth.Login;
using GreenEcoCommerce.Application.Features.Auth.Register;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GreenEcoCommerce.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
[ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
[ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
public class AuthController(ISender sender) : ControllerBase
{
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
    [ProducesResponseType<object>(StatusCodes.Status200OK, Description = "Đăng ký người dùng thành công.")]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest, Description = "Dữ liệu không hợp lệ. Sai định dạng Email/Phone hoặc thông tin đã tồn tại.")]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError, Description = "Lỗi hệ thống.")]
    public async Task<IActionResult> Register(RegisterCommand command)
    {
        var id = await sender.Send(command);
        return Ok(new { id });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginCommand command)
    {
        var token = await sender.Send(command);

        var cookieOptions = new CookieOptions
        {
            HttpOnly = true, // Ngăn js/ts truy cập vào token
            Secure = true,   // Bắt buộc dùng HTTPS (ở localhost .NET tự chạy HTTPS)
            SameSite = SameSiteMode.Strict, // Chống tấn công CSRF
            Expires = DateTime.UtcNow.AddDays(7) // Thời gian sống của Cookie
        };

        // Ghi cookie vào Response với tên là "AccessToken"
        Response.Cookies.Append("AccessToken", token, cookieOptions);

        return Ok(new { message = "Login successful" });
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Delete("auth_token");
        return Ok(new { message = "Logout successful" });
    }

    [HttpGet("me")]
    [Authorize]
    [ProducesResponseType<UserProfileResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetMe()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
        {
            return Unauthorized(new ProblemDetails { Title = "Invalid user ID in token" });
        }

        var response = await sender.Send(new GetMeQuery(userId));
        return Ok(response);
    }
}
