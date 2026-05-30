using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Infrastructure.Repositories;

public class CategoryRepository(IApplicationDbContext context): ICategoryRepository
{
    public async Task<Category?> GetByIdAsync(Guid id, CancellationToken ct)
    {
        return await context.Categories.FindAsync([id], ct);
    }

    public async Task<List<Category>> GetAllAsync(CancellationToken ct)
    {
        return await context.Categories.ToListAsync(ct);
    }

    public async Task<Category> AddAsync(Category category, CancellationToken ct)
    {
        await context.Categories.AddAsync(category, ct);
        await context.SaveChangesAsync(ct);

        return category;
    }

    public async Task<bool> UpdateAsync(Category category, CancellationToken ct)
    {
        int affectedRows = await context.Categories.Where(c => c.Id == category.Id)
            .ExecuteUpdateAsync(set => set
                .SetProperty(c => c.Name, category.Name)
                .SetProperty(c => c.Description, category.Description)
                .SetProperty(c => c.ParentId, category.ParentId),
                ct);

        return affectedRows > 0;
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct)
    {
        await context.Categories.Where(c => c.Id == id).ExecuteDeleteAsync(ct);
    }
}
