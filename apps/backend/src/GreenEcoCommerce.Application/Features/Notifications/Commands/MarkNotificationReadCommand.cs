using GreenEcoCommerce.Application.Interfaces.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Notifications.Commands;

public record MarkNotificationReadCommand(Guid NotificationId, Guid UserId) : IRequest
{
    public class Handler(IApplicationDbContext dbContext) : IRequestHandler<MarkNotificationReadCommand>
    {
        public async Task Handle(MarkNotificationReadCommand command, CancellationToken ct)
        {
            await dbContext.Notifications
                .Where(n => n.Id == command.NotificationId && n.UserId == command.UserId)
                .ExecuteUpdateAsync(set => set.SetProperty(n => n.IsRead, true), ct);
        }
    }
}
