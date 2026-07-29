using GreenEcoCommerce.Application.Interfaces.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Notifications.Queries;

public record GetUnreadNotificationCountQuery(Guid UserId) : IRequest<int>
{
    public class Handler(IApplicationDbContext dbContext) : IRequestHandler<GetUnreadNotificationCountQuery, int>
    {
        public Task<int> Handle(GetUnreadNotificationCountQuery request, CancellationToken ct)
        {
            return dbContext.Notifications.CountAsync(n => n.UserId == request.UserId && !n.IsRead, ct);
        }
    }
}
