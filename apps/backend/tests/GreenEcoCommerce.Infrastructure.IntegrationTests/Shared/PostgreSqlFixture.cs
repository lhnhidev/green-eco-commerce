using GreenEcoCommerce.Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using Testcontainers.PostgreSql;

namespace GreenEcoCommerce.Infrastructure.IntegrationTests.Shared;

/// <summary>
/// A shared xUnit fixture that starts a PostgreSQL Testcontainer once per test
/// collection. Each test should create its own <see cref="ApplicationDbContext"/>
/// via <see cref="CreateDbContext"/> so that EF Core's change tracker is isolated.
/// </summary>
public sealed class PostgreSqlFixture : IAsyncLifetime
{
    // ---------------------------------------------------------------------------
    // Container bootstrap
    // ---------------------------------------------------------------------------
    private readonly PostgreSqlContainer container = new PostgreSqlBuilder("postgres:18-alpine")
            .WithDatabase("greenecommerce_test")
            .WithUsername("postgres")
            .WithPassword("postgres")
            .Build();

    /// <summary>The connection string to the running container.</summary>
    public string ConnectionString => container.GetConnectionString();

    // ---------------------------------------------------------------------------
    // IAsyncLifetime
    // ---------------------------------------------------------------------------

    public async ValueTask InitializeAsync()
    {
        await container.StartAsync();

        // Create the schema once – every test can share the same database schema.
        await using var ctx = CreateDbContext();
        await ctx.Database.EnsureCreatedAsync();
    }

    public async ValueTask DisposeAsync()
    {
        await container.DisposeAsync();
    }

    // ---------------------------------------------------------------------------
    // Factory helpers
    // ---------------------------------------------------------------------------

    /// <summary>
    /// Returns a brand-new <see cref="ApplicationDbContext"/> connected to the
    /// running container. Callers are responsible for disposing the context.
    /// </summary>
    public ApplicationDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseNpgsql(ConnectionString)
            .Options;

        return new ApplicationDbContext(options);
    }
}
