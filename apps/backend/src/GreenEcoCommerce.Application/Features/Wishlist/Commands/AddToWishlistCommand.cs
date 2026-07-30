using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Wishlist.Commands;

public record AddToWishlistCommand(Guid UserId, Guid ProductId) : IRequest<bool>
{
    public class Handler(IApplicationDbContext dbContext) : IRequestHandler<AddToWishlistCommand, bool>
    {
        public async Task<bool> Handle(AddToWishlistCommand request, CancellationToken ct)
        {
            bool exists = await dbContext.WishlistItems.AnyAsync(
                w => w.UserId == request.UserId && w.ProductId == request.ProductId,
                ct);

            if (exists) return false; // already in wishlist

            await dbContext.WishlistItems.AddAsync(
                new WishlistItem
                {
                    UserId = request.UserId,
                    ProductId = request.ProductId,
                },
                ct);

            await dbContext.SaveChangesAsync(ct);
            return true;
        }
    }
}
