using GreenEcoCommerce.Application.Features.Products;
using GreenEcoCommerce.Application.Interfaces.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Wishlist.Queries;

public record GetWishlistQuery(Guid UserId) : IRequest<ProductDto[]>
{
    public class Handler(IApplicationDbContext dbContext) : IRequestHandler<GetWishlistQuery, ProductDto[]>
    {
        public async Task<ProductDto[]> Handle(GetWishlistQuery request, CancellationToken ct)
        {
            return await dbContext.WishlistItems
                .Where(w => w.UserId == request.UserId && w.Product.IsActive)
                .OrderByDescending(w => w.CreatedAt)
                .Select(w => w.Product)
                .ProjectToDto()
                .ToArrayAsync(ct);
        }
    }
}
