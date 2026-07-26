using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Application.Queries;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Reviews.Queries;

public record GetProductReviewsQuery(Guid ProductId) : IRequest<ReviewDto[]>
{
    public class Handler(IApplicationDbContext db) : IRequestHandler<GetProductReviewsQuery, ReviewDto[]>
    {
        public async Task<ReviewDto[]> Handle(GetProductReviewsQuery req, CancellationToken ct)
        {
            return await db.Reviews
                    .IncludeUser()
                    .OfProduct(req.ProductId)
                    .OrderByDescending(r => r.CreatedAt)
                    .ProjectToDto()
                    .ToArrayAsync(ct);
        }
    }
}
