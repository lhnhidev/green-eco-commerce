using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Interfaces;

namespace GreenEcoCommerce.Infrastructure.Repositories;

public class PointTransactionRepository(IApplicationDbContext context) : IPointTransactionRepository
{
    public async Task<PointTransaction> AddPointTransactionAsync(PointTransaction pointTransaction,
        CancellationToken ct = default)
    {
        await context.PointTransactions.AddAsync(pointTransaction);
        await context.SaveChangesAsync();
        return pointTransaction;
    }
}
