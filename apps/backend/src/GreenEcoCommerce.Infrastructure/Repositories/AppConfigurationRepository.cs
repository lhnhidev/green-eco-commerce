using System.Text.Json;
using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Infrastructure.Repositories;

public class AppConfigurationRepository(IApplicationDbContext dbContext) : IAppConfigurationRepository
{
    public async Task<AppConfiguration?> GetByKeyAsync(string key, CancellationToken cancellationToken = default)
    {
        return await dbContext.AppConfigurations
            .FirstOrDefaultAsync(c => c.Key == key, cancellationToken);
    }

    public async Task<IEnumerable<AppConfiguration>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await dbContext.AppConfigurations
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }

    public async Task<T> GetValueAsync<T>(string key, T defaultValue, CancellationToken cancellationToken = default)
    {
        var config = await GetByKeyAsync(key, cancellationToken);

        if (config == null)
        {
            await SetAsync(key, defaultValue, cancellationToken);
            return defaultValue;
        }

        return config.Value.Deserialize<T>()!;
    }

    public async Task SetAsync<T>(string key, T value, CancellationToken cancellationToken = default)
    {
        var existingConfig = await GetByKeyAsync(key, cancellationToken);
        if (existingConfig != null)
        {
            dbContext.AppConfigurations.Remove(existingConfig);
        }

        dbContext.AppConfigurations.Add(new AppConfiguration
        {
            Key = key,
            Value = JsonSerializer.SerializeToDocument(value)
        });
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(string key, CancellationToken cancellationToken = default)
    {
        var config = await GetByKeyAsync(key, cancellationToken);
        if (config != null)
        {
            dbContext.AppConfigurations.Remove(config);
            await dbContext.SaveChangesAsync(cancellationToken);
        }
    }
}
