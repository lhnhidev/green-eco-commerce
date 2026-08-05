using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Application.Queries;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Products.Commands;

public record DeleteProductCommand(Guid Id) : IRequest
{
    public class Handler(IApplicationDbContext dbContext) : IRequestHandler<DeleteProductCommand>
    {
        public async Task Handle(DeleteProductCommand command, CancellationToken ct)
        {
            await dbContext.Products.WithId(command.Id)
                    .ExecuteUpdateAsync(p => p.SetProperty(p => p.IsActive, false), ct);
        }
    }
}
