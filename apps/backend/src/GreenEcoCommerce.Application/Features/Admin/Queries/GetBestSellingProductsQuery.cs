using GreenEcoCommerce.Application.Interfaces.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Admin.Queries;

public record GetBestSellingProductsQuery(int Top = 10, int? Month = null, int? Year = null)
        : IRequest<GetBestSellingProductsQuery.Response[]>
{
    public record Response(
        Guid ProductId,
        string Name,
        string? ImageUrl,
        int TotalUnitsSold,
        decimal TotalRevenue,
        decimal CarbonIndex);

    public class Handler(IApplicationDbContext dbContext) : IRequestHandler<GetBestSellingProductsQuery, Response[]>
    {
        public async Task<Response[]> Handle(GetBestSellingProductsQuery request, CancellationToken ct)
        {
            // UTC-zero-offset construction: Order.CreatedAt is timestamptz, and Npgsql rejects
            // DateTimeOffset parameters with a non-zero offset for that column type.
            DateTimeOffset? periodStart = null;
            DateTimeOffset? periodEnd = null;

            if (request.Month.HasValue && request.Year.HasValue)
            {
                periodStart = new DateTimeOffset(request.Year.Value, request.Month.Value, 1, 0, 0, 0, TimeSpan.Zero);
                periodEnd = periodStart.Value.AddMonths(1);
            }

            return await dbContext.Products
                    .OrderByDescending(p => p.OrderItems
                        .Where(oi => periodStart == null || (oi.Order.CreatedAt >= periodStart && oi.Order.CreatedAt < periodEnd))
                        .Sum(oi => oi.Quantity))
                    .Take(request.Top)
                    .Select(p => new Response(
                        p.Id,
                        p.Name,
                        p.ImageUrl.FirstOrDefault(),
                        p.OrderItems
                            .Where(oi => periodStart == null || (oi.Order.CreatedAt >= periodStart && oi.Order.CreatedAt < periodEnd))
                            .Sum(oi => oi.Quantity),
                        p.OrderItems
                            .Where(oi => periodStart == null || (oi.Order.CreatedAt >= periodStart && oi.Order.CreatedAt < periodEnd))
                            .Sum(oi => oi.UnitPrice * oi.Quantity),
                        p.CarbonIndex))
                    .ToArrayAsync(ct);
        }
    }
}
