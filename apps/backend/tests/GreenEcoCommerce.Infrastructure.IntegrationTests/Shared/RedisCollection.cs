namespace GreenEcoCommerce.Infrastructure.IntegrationTests.Shared;

/// <summary>
/// Registers the "Redis" xUnit collection and associates it with
/// <see cref="RedisFixture"/> so the container is started only once
/// and shared across all test classes in the collection.
/// </summary>
[CollectionDefinition("Redis")]
public sealed class RedisCollection : ICollectionFixture<RedisFixture>;
