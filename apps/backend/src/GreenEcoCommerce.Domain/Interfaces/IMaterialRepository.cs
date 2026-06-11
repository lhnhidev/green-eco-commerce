using GreenEcoCommerce.Domain.Entities;

namespace GreenEcoCommerce.Domain.Interfaces;

public interface IMaterialRepository
{
    Task<Material?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<List<Material>> GetAllAsync(CancellationToken ct = default);
    Task<List<Material>> GetManyAsync(ICollection<Guid> materialIdList, CancellationToken ct = default);
    Task<Material> AddAsync(Material material, CancellationToken ct = default);
    Task<bool> UpdateAsync(Material material, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
}
