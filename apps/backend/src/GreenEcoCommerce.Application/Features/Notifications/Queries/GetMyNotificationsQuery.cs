using GreenEcoCommerce.Application.Common.Models;
using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Domain.Entities;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Notifications.Queries;

public record GetMyNotificationsQuery(Guid UserId, GetMyNotificationsQuery.Parameters Query)
        : IRequest<PagedResult<NotificationDto>>
{
    public class Handler(IApplicationDbContext dbContext)
            : IRequestHandler<GetMyNotificationsQuery, PagedResult<NotificationDto>>
    {
        public async Task<PagedResult<NotificationDto>> Handle(GetMyNotificationsQuery request, CancellationToken ct)
        {
            var query = dbContext.Notifications
                .Where(n => n.UserId == request.UserId)
                .OrderByDescending(n => n.CreatedAt);

            return await request.Query.ApplyAsync(query, NotificationDtoMapper.ProjectToDto, ct);
        }
    }

    public class Parameters : QueryParameters<Notification>;
}
