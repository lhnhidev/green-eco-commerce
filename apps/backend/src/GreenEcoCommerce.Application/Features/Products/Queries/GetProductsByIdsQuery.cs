using GreenEcoCommerce.Application.Interfaces.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Products.Queries;

public record GetProductsByIdsQuery(Guid[] Ids) : IRequest<ProductDto[]>
{
    public class Handler(IApplicationDbContext dbContext) : IRequestHandler<GetProductsByIdsQuery, ProductDto[]>
    {
        public async Task<ProductDto[]> Handle(GetProductsByIdsQuery request, CancellationToken ct)
        {
            if (request.Ids.Length == 0) return [];

            return await dbContext.Products
                .AsNoTracking()
                .Where(p => ((IEnumerable<Guid>)request.Ids).Contains(p.Id))
                .ProjectToDto()
                .ToArrayAsync(ct);
        }
    }
}
