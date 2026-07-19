using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Application.Queries;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Materials.Commands;

public record DeleteMaterialCommand(Guid Id) : IRequest
{
    public class Handler(IApplicationDbContext dbContext) : IRequestHandler<DeleteMaterialCommand>
    {
        public async Task Handle(DeleteMaterialCommand command, CancellationToken ct)
        {
            await dbContext.Materials.WithId(command.Id).ExecuteDeleteAsync(ct);
        }
    }
}
