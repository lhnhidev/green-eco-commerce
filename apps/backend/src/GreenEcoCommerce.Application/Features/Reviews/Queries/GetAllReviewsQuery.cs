using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Reviews.Queries;

public record GetAllReviewsQuery(bool? IsApproved = null, bool? IsHidden = null) : IRequest<ReviewDto[]>
{
    public class Handler(IApplicationDbContext db) : IRequestHandler<GetAllReviewsQuery, ReviewDto[]>
    {
        public async Task<ReviewDto[]> Handle(GetAllReviewsQuery req, CancellationToken ct)
        {
            IQueryable<Review> q = db.Reviews;
            if (req.IsApproved.HasValue) q = q.Where(r => r.IsApproved == req.IsApproved);
            if (req.IsHidden.HasValue) q = q.Where(r => r.IsHidden == req.IsHidden);
            return await q.OrderByDescending(r => r.CreatedAt).ProjectToDto().ToArrayAsync(ct);
        }
    }
}
