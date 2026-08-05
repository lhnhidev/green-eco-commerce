using GreenEcoCommerce.Application.Interfaces.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Notifications.Commands;

public record MarkAllNotificationsReadCommand(Guid UserId) : IRequest
{
    public class Handler(IApplicationDbContext dbContext) : IRequestHandler<MarkAllNotificationsReadCommand>
    {
        public async Task Handle(MarkAllNotificationsReadCommand command, CancellationToken ct)
        {
            await dbContext.Notifications
                .Where(n => n.UserId == command.UserId && !n.IsRead)
                .ExecuteUpdateAsync(set => set.SetProperty(n => n.IsRead, true), ct);
        }
    }
}
