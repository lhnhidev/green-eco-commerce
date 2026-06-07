namespace GreenEcoCommerce.Infrastructure.IntegrationTests.Shared;

/// <summary>
/// Registers the "PostgreSql" xUnit collection and associates it with
/// <see cref="PostgreSqlFixture"/> so the container is started only once
/// and shared across all test classes in the collection.
/// </summary>
[CollectionDefinition("PostgreSql")]
public sealed class PostgreSqlCollection : ICollectionFixture<PostgreSqlFixture>;
