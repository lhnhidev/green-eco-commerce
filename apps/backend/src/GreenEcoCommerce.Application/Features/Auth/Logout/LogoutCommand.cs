using GreenEcoCommerce.Application.Interfaces.Caching;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Auth.Logout;

public record LogoutCommand(Guid id) : IRequest;

public class LogoutHandler(ICacheService cacheService) : IRequestHandler<LogoutCommand>
{
    public async Task Handle(LogoutCommand request, CancellationToken ct)
    {
        await cacheService.RemoveAsync($"refresh_token:{request.id}");
    }
}
