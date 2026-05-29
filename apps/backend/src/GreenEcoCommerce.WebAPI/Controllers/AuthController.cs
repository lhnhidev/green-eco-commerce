using GreenEcoCommerce.Application.Features.Auth.Login;
using GreenEcoCommerce.Application.Features.Auth.Register;
using MediatR;
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
    public async Task<IActionResult> Register(RegisterCommand command)
    {
        var id = await sender.Send(command);
        return Ok(new { id });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginCommand command)
    {
        string token = await sender.Send(command);

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
}
