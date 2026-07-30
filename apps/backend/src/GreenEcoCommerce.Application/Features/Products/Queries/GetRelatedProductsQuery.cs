using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Application.Queries;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Products.Queries;

public record GetRelatedProductsQuery(Guid ProductId, int Limit = 8) : IRequest<ProductDto[]>
{
    public class Handler(IApplicationDbContext dbContext) : IRequestHandler<GetRelatedProductsQuery, ProductDto[]>
    {
        public async Task<ProductDto[]> Handle(GetRelatedProductsQuery request, CancellationToken ct)
        {
            // Get the category of the current product
            var product = await dbContext.Products
                .AsNoTracking()
                .Where(p => p.Id == request.ProductId)
                .Select(p => new { p.CategoryId })
                .FirstOrDefaultAsync(ct);

            if (product == null) return [];

            // Return active products in the same category, excluding the current product
            return await dbContext.Products
                .AsNoTracking()
                .Where(p => p.CategoryId == product.CategoryId && p.Id != request.ProductId && p.IsActive)
                .ProjectToDto()
                .Take(request.Limit)
                .ToArrayAsync(ct);
        }
    }
}
