using GreenEcoCommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Queries;

public static class ReviewQueries
{
    extension(IQueryable<Review> query)
    {
        public IQueryable<Review> OfProduct(Guid productId, bool isApproved = true)
        {
            var q = query.Where(r => r.ProductId == productId);
            if (isApproved) q = q.Where(r => r.IsApproved && !r.IsHidden);
            return q;
        }

        public IQueryable<Review> IncludeUser() => query.Include(r => r.User);

        public IQueryable<Review> OfUser(Guid userId, bool isApproved = true)
        {
            var q = query.Where(r => r.UserId == userId);
            if (isApproved) q = q.Where(r => r.IsApproved && !r.IsHidden);
            return q;
        }
    }
}
