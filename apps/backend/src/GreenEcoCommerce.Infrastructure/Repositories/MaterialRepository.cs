using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Infrastructure.Repositories;

public class MaterialRepository(IApplicationDbContext context) : IMaterialRepository
{
    public async Task<Material?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        var material = await context.Materials.FindAsync([id], ct);
        return material;
    }

    public async Task<List<Material>> GetAllAsync(CancellationToken ct = default)
    {
        var materials = await context.Materials.ToListAsync(ct);
        return materials;
    }

    public async Task<List<Material>> GetManyAsync(ICollection<Guid> materialIdList, CancellationToken ct = default)
    {
        var materials = await context.Materials
            .Where(m => materialIdList.Contains(m.Id))
            .ToListAsync(ct);

        return materials;
    }

    public async Task<Material> AddAsync(Material material, CancellationToken ct = default)
    {
        await context.Materials.AddAsync(material, ct);
        await context.SaveChangesAsync(ct);

        return material;
    }

    public async Task<bool> UpdateAsync(Material material, CancellationToken ct = default)
    {
        int affectedRows = await context.Materials
            .Where(m => m.Id == material.Id)
            .ExecuteUpdateAsync(set => set
                    .SetProperty(m => m.Name, material.Name)
                    .SetProperty(m => m.Type, material.Type)
                    .SetProperty(m => m.EcoRating, material.EcoRating),
                ct);

        return affectedRows > 0;
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        await context.Materials.Where(m => m.Id == id).ExecuteDeleteAsync(ct);
    }
}
