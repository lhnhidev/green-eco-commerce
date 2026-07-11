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

    public async Task<List<Product>> GetByIdsAsync(List<Guid> ids, CancellationToken ct = default)
    {
        var productList = await context.Products
            .Include(p => p.Materials)
            .Where(p => ids.Contains(p.Id)).ToListAsync(ct);

        return productList;
    }

    public async Task<List<Product>> SearchByNameAsync(string name, CancellationToken ct = default)
    {
        var productList = await context.Products
            .Include(p => p.Materials)
            .Where(p => p.Name.ToLower().Contains(name.ToLower()))
            .ToListAsync(ct);

        return productList;
    }

    public Task<bool> ProductExistsAsync(Guid id, CancellationToken ct = default)
    {
        return context.Products.AnyAsync(p => p.Id == id, ct);
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

    public async Task<(List<Product> Products, int TotalCount)> GetSomeAsync(Domain.Models.ProductFilterParams filterParams, CancellationToken ct = default)
    {
        var query = context.Products.Include(p => p.Materials).AsQueryable();

        if (!string.IsNullOrWhiteSpace(filterParams.SearchTerm))
        {
            query = query.Where(p => p.Name.ToLower().Contains(filterParams.SearchTerm.ToLower()));
        }

        if (filterParams.CategoryId.HasValue)
        {
            query = query.Where(p => p.CategoryId == filterParams.CategoryId.Value);
        }

        if (filterParams.MinPrice.HasValue)
        {
            query = query.Where(p => p.Price >= filterParams.MinPrice.Value);
        }

        if (filterParams.MaxPrice.HasValue)
        {
            query = query.Where(p => p.Price <= filterParams.MaxPrice.Value);
        }

        if (filterParams.IsOrganic == true)
        {
            query = query.Where(p => p.Materials.Any(m => m.Type == Domain.Enums.MaterialTypeEnum.Organic));
        }

        if (filterParams.IsBiodegradable == true)
        {
            query = query.Where(p => p.Materials.Any(m => m.Type == Domain.Enums.MaterialTypeEnum.Biodegradable) || p.DecomposePercent > 0);
        }

        if (filterParams.IsRecycled == true)
        {
            query = query.Where(p => p.Materials.Any(m => m.Type == Domain.Enums.MaterialTypeEnum.Recycled) || p.RecyclePercent > 0);
        }

        int totalCount = await query.CountAsync(ct);

        query = filterParams.SortBy?.ToLower() switch
        {
            "price" => filterParams.IsDescending ? query.OrderByDescending(p => p.Price) : query.OrderBy(p => p.Price),
            "carbon" => filterParams.IsDescending ? query.OrderByDescending(p => p.CarbonIndex) : query.OrderBy(p => p.CarbonIndex),
            "name" => filterParams.IsDescending ? query.OrderByDescending(p => p.Name) : query.OrderBy(p => p.Name),
            _ => filterParams.IsDescending ? query.OrderByDescending(p => p.Id) : query.OrderByDescending(p => p.Id) // default
        };

        var products = await query
            .Skip(filterParams.PageSize * (filterParams.PageNumber - 1))
            .Take(filterParams.PageSize)
            .ToListAsync(ct);

        return (products, totalCount);
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct)
    {
        await context.Products.Where(p => p.Id == id).ExecuteDeleteAsync(ct);
    }
}
