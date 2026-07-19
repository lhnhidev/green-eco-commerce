using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.StackExchangeRedis;
using Microsoft.Extensions.Options;
using Testcontainers.Redis;

namespace GreenEcoCommerce.Infrastructure.IntegrationTests.Shared;

/// <summary>
/// A shared xUnit fixture that starts a Redis Testcontainer once per test
/// collection. Provides factory methods for creating <see cref="IDistributedCache"/>
/// instances backed by the container.
/// </summary>
public sealed class RedisFixture : IAsyncLifetime
{
    // ---------------------------------------------------------------------------
    // Container bootstrap
    // ---------------------------------------------------------------------------
    private readonly RedisContainer container = new RedisBuilder("redis:8-alpine").Build();

    /// <summary>The connection string to the running Redis container.</summary>
    public string ConnectionString => container.GetConnectionString();

    // ---------------------------------------------------------------------------
    // IAsyncLifetime
    // ---------------------------------------------------------------------------

    public async ValueTask InitializeAsync()
    {
        await container.StartAsync();
    }

    public async ValueTask DisposeAsync()
    {
        await container.DisposeAsync();
    }

    // ---------------------------------------------------------------------------
    // Factory helpers
    // ---------------------------------------------------------------------------

    /// <summary>
    /// Returns a <see cref="IDistributedCache"/> backed by the running Redis container.
    /// </summary>
    public IDistributedCache CreateDistributedCache()
    {
        var options = Options.Create(new RedisCacheOptions
        {
            Configuration = ConnectionString
        });

        return new RedisCache(options);
    }
}
