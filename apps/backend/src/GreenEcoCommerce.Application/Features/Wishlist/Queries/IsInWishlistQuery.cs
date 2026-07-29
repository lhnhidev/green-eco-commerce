using GreenEcoCommerce.Application.Interfaces.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Wishlist.Queries;

public record IsInWishlistQuery(Guid UserId, Guid ProductId) : IRequest<bool>
{
    public class Handler(IApplicationDbContext dbContext) : IRequestHandler<IsInWishlistQuery, bool>
    {
        public async Task<bool> Handle(IsInWishlistQuery request, CancellationToken ct)
        {
            return await dbContext.WishlistItems.AnyAsync(
                w => w.UserId == request.UserId && w.ProductId == request.ProductId && w.Product.IsActive,
                ct);
        }
    }
}
