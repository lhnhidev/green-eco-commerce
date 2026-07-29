using GreenEcoCommerce.Application.Interfaces.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Wishlist.Commands;

public record RemoveFromWishlistCommand(Guid UserId, Guid ProductId) : IRequest
{
    public class Handler(IApplicationDbContext dbContext) : IRequestHandler<RemoveFromWishlistCommand>
    {
        public async Task Handle(RemoveFromWishlistCommand request, CancellationToken ct)
        {
            await dbContext.WishlistItems
                .Where(w => w.UserId == request.UserId && w.ProductId == request.ProductId)
                .ExecuteDeleteAsync(ct);
        }
    }
}
