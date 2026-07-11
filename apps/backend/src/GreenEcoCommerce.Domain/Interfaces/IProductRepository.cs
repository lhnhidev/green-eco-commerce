using GreenEcoCommerce.Domain.Entities;

namespace GreenEcoCommerce.Domain.Interfaces;

public interface IProductRepository
{
    Task<Product?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<List<Product>> GetByIdsAsync(List<Guid> ids, CancellationToken ct = default);
    Task<List<Product>> SearchByNameAsync(string name, CancellationToken ct = default);
    Task<bool> ProductExistsAsync(Guid id, CancellationToken ct = default);
    Task<List<Product>> GetAllAsync(CancellationToken ct = default);
    Task<Product> AddAsync(Product product, CancellationToken ct = default);
    Task<bool> UpdateAsync(Product product, CancellationToken ct = default);
    Task<(List<Product> Products, int TotalCount)> GetSomeAsync(Models.ProductFilterParams filterParams, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
}
