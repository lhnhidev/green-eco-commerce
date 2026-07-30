using GreenEcoCommerce.Application.Interfaces.Environment;

namespace GreenEcoCommerce.WebAPI;

public class ApplicationEnvironment(IWebHostEnvironment env) : IApplicationEnvironment
{
    public string WebRootPath => env.WebRootPath;
}
