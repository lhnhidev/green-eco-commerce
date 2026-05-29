using GreenEcoCommerce.Domain.Entities;

namespace GreenEcoCommerce.Application.Interfaces.Security;

public interface IJwtService
{
    string GenerateToken(User user);
    string GenerateRefreshToken();
}
