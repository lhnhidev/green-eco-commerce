using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Application.Queries;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Carts.Commands;

public record ClearCartCommand(Guid UserId) : IRequest
{
    public class Handler(IApplicationDbContext dbContext) : IRequestHandler<ClearCartCommand>
    {
        public async Task Handle(ClearCartCommand command, CancellationToken ct)
        {
            await dbContext.Carts.ClearAsync(command.UserId, ct);
            await dbContext.SaveChangesAsync(ct);
        }
    }
}
