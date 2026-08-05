using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Application.Queries;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Payments.Queries;

public record GetTotalRevenueQuery : IRequest<decimal>
{
    public class Handler(IApplicationDbContext dbContext) : IRequestHandler<GetTotalRevenueQuery, decimal>
    {
        public async Task<decimal> Handle(GetTotalRevenueQuery request, CancellationToken ct)
        {
            var totalRevenue = await dbContext.Payments.IsPaid().SumAsync(p => p.Amount, ct);
            return totalRevenue;
        }
    }
}
