using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Application.Queries;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Categories.Commands;

public record DeleteCategoryCommand(Guid Id) : IRequest
{
    public class Handler(IApplicationDbContext dbContext) : IRequestHandler<DeleteCategoryCommand>
    {
        public async Task Handle(DeleteCategoryCommand command, CancellationToken ct)
        {
            await dbContext.Categories.WithId(command.Id).ExecuteDeleteAsync(ct);
        }
    }
}
