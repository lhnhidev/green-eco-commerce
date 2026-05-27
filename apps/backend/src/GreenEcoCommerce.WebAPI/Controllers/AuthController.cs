using GreenEcoCommerce.Application.Features.Auth.Login;
using GreenEcoCommerce.Application.Features.Auth.Register;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace GreenEcoCommerce.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
    public class AuthController : ControllerBase
    {
        private readonly ISender _sender;
        public AuthController(ISender sender) => _sender = sender;

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterCommand command)
        {
            var id = await _sender.Send(command);
            return Ok(new { id });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginCommand command)
        {
            var token = await _sender.Send(command);
            return Ok(new { token });
        }
    }
}
