using GreenEcoCommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Queries;

public static class CartQueries
{
    extension (IQueryable<Cart> query)
    {
        public IQueryable<Cart> OfUser(Guid userId)
        {
            return query.Where(c => c.UserId == userId);
        }

        public IQueryable<Cart> IncludeCartItems(bool withProducts = true)
        {
            var q = query.Include(c => c.CartItems);
            if (withProducts)
            {
                return q.ThenInclude(ci => ci.Product);
            }

            return q;
        }

        public async Task ClearAsync(Guid userId, CancellationToken ct)
        {
            await query.OfUser(userId).ExecuteDeleteAsync(ct);
        }
    }
}
