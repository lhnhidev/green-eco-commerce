using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Application.Queries;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Products.Queries;

public record GetProductByIdQuery(Guid Id) : IRequest<ProductDto?>
{
    public class Handler(IApplicationDbContext dbContext) : IRequestHandler<GetProductByIdQuery, ProductDto?>
    {
        public async Task<ProductDto?> Handle(GetProductByIdQuery request, CancellationToken ct)
        {
            var product = await dbContext.Products.WithId(request.Id).ProjectToDto().FirstOrDefaultAsync(ct);
            return product;
        }
    }
}
