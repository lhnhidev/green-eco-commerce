using GreenEcoCommerce.Domain.Entities;

namespace GreenEcoCommerce.Domain.Interfaces;

public interface IAppConfigurationRepository
{
    Task<AppConfiguration?> GetByKeyAsync(string key, CancellationToken cancellationToken = default);
    Task<IEnumerable<AppConfiguration>> GetAllAsync(CancellationToken cancellationToken = default);

    // Helper methods for strongly typed access
    Task<T> GetValueAsync<T>(string key, T defaultValue, CancellationToken cancellationToken = default);

    Task SetAsync<T>(string key, T value, CancellationToken cancellationToken = default);
    Task DeleteAsync(string key, CancellationToken cancellationToken = default);
}
