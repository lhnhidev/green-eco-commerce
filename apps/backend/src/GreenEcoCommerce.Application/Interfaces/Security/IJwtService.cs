using System.Security.Claims;
using GreenEcoCommerce.Domain.Entities;

namespace GreenEcoCommerce.Application.Interfaces.Security;

public interface IJwtService
{
    string GenerateToken(User user, int minutesExprired);
    string GenerateRefreshToken();
    ClaimsPrincipal ValidateToken(string token, bool validateLifetime = true);
}
