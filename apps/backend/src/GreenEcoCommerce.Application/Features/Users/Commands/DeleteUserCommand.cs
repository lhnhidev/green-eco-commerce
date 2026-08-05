using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Application.Queries;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Users.Commands;

public record DeleteUserCommand(Guid Id) : IRequest
{
    public class Handler(IApplicationDbContext dbContext) : IRequestHandler<DeleteUserCommand>
    {
        public async Task Handle(DeleteUserCommand command, CancellationToken ct)
        {
            await dbContext.Users.WithId(command.Id)
                    .ExecuteUpdateAsync(s => s.SetProperty(u => u.IsActive, false), ct);
            await dbContext.Users.WithId(command.Id)
                    .ExecuteUpdateAsync(s => s.SetProperty(u => u.IsDeleted, true), ct);
        }
    }
}
