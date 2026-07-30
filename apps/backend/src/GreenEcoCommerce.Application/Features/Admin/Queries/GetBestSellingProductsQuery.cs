using GreenEcoCommerce.Application.Interfaces.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Admin.Queries;

public record GetBestSellingProductsQuery(int Top = 10) : IRequest<GetBestSellingProductsQuery.Response[]>
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
            return await dbContext.Products
                    .OrderByDescending(p => p.OrderItems.Sum(oi => oi.Quantity))
                    .Take(request.Top)
                    .Select(p => new Response(
                        p.Id,
                        p.Name,
                        p.ImageUrl.FirstOrDefault(),
                        p.OrderItems.Sum(oi => oi.Quantity),
                        p.OrderItems.Sum(oi => oi.UnitPrice * oi.Quantity),
                        p.CarbonIndex))
                    .ToArrayAsync(ct);
        }
    }
}
