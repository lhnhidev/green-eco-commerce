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

        public async Task UpdateStockQtyAsync(Guid id, int quantity, CancellationToken ct = default)
        {
            await query.WithId(id)
                .ExecuteUpdateAsync(s => s.SetProperty(p => p.StockQty, p => quantity), ct);
        }
    }
}
