using GreenEcoCommerce.Application.Interfaces.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Documents.Queries;

public record GetDocumentsQuery : IRequest<DocumentDto[]>
{
    public class Handler(IApplicationDbContext dbContext) : IRequestHandler<GetDocumentsQuery, DocumentDto[]>
    {
        public async Task<DocumentDto[]> Handle(GetDocumentsQuery request, CancellationToken ct)
        {
            return await dbContext.Documents
                    .OrderByDescending(d => d.CreatedAt)
                    .ProjectToDto()
                    .ToArrayAsync(ct);
        }
    }
}
