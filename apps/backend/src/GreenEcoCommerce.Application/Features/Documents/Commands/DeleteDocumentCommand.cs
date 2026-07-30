using GreenEcoCommerce.Application.Interfaces.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Documents.Commands;

public record DeleteDocumentCommand(Guid Id) : IRequest
{
    public class Handler(IApplicationDbContext dbContext) : IRequestHandler<DeleteDocumentCommand>
    {
        public async Task Handle(DeleteDocumentCommand request, CancellationToken ct)
        {
            await dbContext.Documents.Where(d => d.Id == request.Id).ExecuteDeleteAsync(ct);
        }
    }
}
