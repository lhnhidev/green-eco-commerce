using GreenEcoCommerce.Application.Interfaces.Caching;
using Microsoft.Extensions.Caching.Distributed;

namespace GreenEcoCommerce.Infrastructure.Caching;

public class RedisCacheService(IDistributedCache distributedCache) : ICacheService
{
    public async Task<T?> GetAsync<T>(string key, CancellationToken cancellationToken = default)
    {
        var cachedData = await distributedCache.GetStringAsync(key, cancellationToken);
        if (cachedData == null)
        {
            return default;
        }

        return System.Text.Json.JsonSerializer.Deserialize<T>(cachedData);
    }

    public async Task SetAsync<T>(string key, T value, TimeSpan? expiration = null, CancellationToken cancellationToken = default)
    {
        var options = new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = expiration ?? TimeSpan.FromHours(3) // Mặc định 3 giờ
        };

        var serializedData = System.Text.Json.JsonSerializer.Serialize(value);
        await distributedCache.SetStringAsync(key, serializedData, options, cancellationToken);
    }

    public async Task RemoveAsync(string key, CancellationToken cancellationToken = default)
    {
        await distributedCache.RemoveAsync(key, cancellationToken);
    }
}
