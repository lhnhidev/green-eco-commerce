using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GreenEcoCommerce.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TestController : ControllerBase
{
    [HttpGet]
    public IActionResult GetAll() => Ok("Danh sách sản phẩm");

    [HttpDelete("{id:guid}")]
    [Authorize(Policy = "AdminOnly")]
    public IActionResult Delete(Guid id) => Ok($"Đã xóa {id}");
}
