using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Infrastructure.Repositories;

public class ProductRepository(IApplicationDbContext context) : IProductRepository
{
    public async Task<Product?> GetByIdAsync(Guid id, CancellationToken ct)
    {
        return await context.Products
            .Include(p => p.Materials)
            .FirstOrDefaultAsync(p => p.Id == id, ct);
    }

    public async Task<List<Product>> GetAllAsync(CancellationToken ct)
    {
        return await context.Products.Include(p => p.Materials).ToListAsync(ct);
    }

    public async Task<Product> AddAsync(Product product, CancellationToken ct)
    {
        await context.Products.AddAsync(product, ct);
        await context.SaveChangesAsync(ct);
        return product;
    }

    public async Task<bool> UpdateAsync(Product product, CancellationToken ct)
    {
        int affectedRows = await context.Products
            .Where(p => p.Id == product.Id)
            .ExecuteUpdateAsync(set => set
                .SetProperty(p => p.Name, product.Name)
                .SetProperty(p => p.Description, product.Description)
                .SetProperty(p => p.Price, product.Price)
                .SetProperty(p => p.StockQty, product.StockQty)
                .SetProperty(p => p.CategoryId, product.CategoryId)
                .SetProperty(p => p.CarbonIndex, product.CarbonIndex)
                .SetProperty(p => p.BaselineCarbonIndex, product.BaselineCarbonIndex)
                .SetProperty(p => p.DecomposePercent, product.DecomposePercent)
                .SetProperty(p => p.RecyclePercent, product.RecyclePercent)
                .SetProperty(p => p.ImageUrl, product.ImageUrl),
            ct);

        return affectedRows > 0;
    }

    public async Task<List<Product>> GetSomeAsync(int pageSize, int pageNumber, CancellationToken ct = default)
    {
        var products = await context.Products
            .Skip(pageSize * (pageNumber - 1))
            .Take(pageSize)
            .Include(p => p.Materials)
            .ToListAsync(ct);
        return products;
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct)
    {
        await context.Products.Where(p => p.Id == id).ExecuteDeleteAsync(ct);
    }
}
