using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Application.Queries;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Reviews.Queries;

public record ProductReviewSummaryDto(Guid ProductId, int TotalCount, double AverageRating);

/// <summary>
/// Rating aggregate over every visible review of a product. Kept separate from the paginated
/// list because an average computed from one page would only describe that page.
/// </summary>
public record GetProductReviewSummaryQuery(Guid ProductId) : IRequest<ProductReviewSummaryDto>
{
    public class Handler(IApplicationDbContext db)
            : IRequestHandler<GetProductReviewSummaryQuery, ProductReviewSummaryDto>
    {
        public async Task<ProductReviewSummaryDto> Handle(GetProductReviewSummaryQuery req, CancellationToken ct)
        {
            var stats = await db.Reviews.OfProduct(req.ProductId)
                                .GroupBy(_ => 1)
                                .Select(g => new
                                {
                                    TotalCount = g.Count(),
                                    AverageRating = g.Average(r => (double)r.Rating)
                                })
                                .FirstOrDefaultAsync(ct);

            return stats is null
                    ? new ProductReviewSummaryDto(req.ProductId, 0, 0)
                    : new ProductReviewSummaryDto(req.ProductId, stats.TotalCount, Math.Round(stats.AverageRating, 2));
        }
    }
}