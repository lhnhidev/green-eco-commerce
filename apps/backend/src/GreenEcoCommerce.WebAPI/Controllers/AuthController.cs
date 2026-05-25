using GreenEcoCommerce.Application.Features.Auth.Login;
using GreenEcoCommerce.Application.Features.Auth.Register;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace GreenEcoCommerce.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
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
        return Ok(new { token });
    }
}
