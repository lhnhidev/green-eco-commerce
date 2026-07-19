using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Application.Queries;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Users.Commands;

public record ToggleUserStateCommand(Guid Id, bool Active) : IRequest
{
    public class Handler(IApplicationDbContext dbContext) : IRequestHandler<ToggleUserStateCommand>
    {
        public async Task Handle(ToggleUserStateCommand command, CancellationToken ct)
        {
            await dbContext.Users.WithId(command.Id)
                    .ExecuteUpdateAsync(s => s.SetProperty(u => u.IsActive, command.Active), ct);
        }
    }
}
