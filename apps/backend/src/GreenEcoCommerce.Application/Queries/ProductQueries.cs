using GreenEcoCommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Queries;

public static class ProductQueries
{
    extension(IQueryable<Product> query)
    {
        public IQueryable<Product> WithId(Guid id)
        {
            return query.Where(p => p.Id == id);
        }

        public IQueryable<Product> IncludeMaterials()
        {
            return query.Include(p => p.Materials);
        }

        // Atomic conditional decrement: the WHERE and SET both evaluate against the row's
        // current value at UPDATE time, so concurrent checkouts can't both pass a stale
        // in-memory stock check and overwrite each other's decrement (lost update).
        public async Task<bool> TryDecrementStockAsync(Guid id, int quantity, CancellationToken ct = default)
        {
            var affected = await query.WithId(id)
                .Where(p => p.StockQty >= quantity)
                .ExecuteUpdateAsync(s => s.SetProperty(p => p.StockQty, p => p.StockQty - quantity), ct);
            return affected > 0;
        }
    }
}
