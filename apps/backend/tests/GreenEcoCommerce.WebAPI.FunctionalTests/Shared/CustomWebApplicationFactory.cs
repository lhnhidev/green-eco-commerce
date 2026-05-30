using GreenEcoCommerce.Infrastructure.Persistence.Context;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Testcontainers.PostgreSql;

namespace GreenEcoCommerce.WebAPI.FunctionalTests.Shared;

public class CustomWebApplicationFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    // 1. Define the PostgreSQL container
    private readonly PostgreSqlContainer dbContainer = new PostgreSqlBuilder("postgres:18-alpine")
        .WithDatabase("test_db")
        .WithUsername("postgres")
        .WithPassword("postgres")
        .Build();

    // 2. Start the container before tests run
    public async ValueTask InitializeAsync()
    {
        await dbContainer.StartAsync();

        // 3. (Optional but recommended) Run your EF Core migrations/schema creation
        using var scope = Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        // Use MigrateAsync() if you use EF Migrations, or EnsureCreatedAsync() if not
        await db.Database.MigrateAsync();
    }

    // 4. Dispose the container when tests finish
    public new async Task DisposeAsync()
    {
        await dbContainer.DisposeAsync();
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Development");

        builder.ConfigureAppConfiguration((_, config) =>
        {
            config.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:SecretKey"] = "test-secret-key-that-is-long-enough-32ch",
                ["Jwt:Issuer"] = "test",
                ["Jwt:Audience"] = "test"
                // Notice we removed the dummy ConnectionString here.
                // We will inject the real one directly into DbContextOptions below.
            });
        });

        builder.ConfigureServices(services =>
        {
            // 5. Remove the existing DbContext registration (using your robust logic)
            var descriptorsToRemove = services
                .Where(d =>
                    d.ServiceType == typeof(DbContextOptions<ApplicationDbContext>) ||
                    d.ServiceType == typeof(ApplicationDbContext) ||
                    d.ImplementationType == typeof(ApplicationDbContext) ||
                    (d.ServiceType.IsGenericType &&
                     d.ServiceType.GetGenericTypeDefinition() == typeof(DbContextOptions<>) &&
                     d.ServiceType.GetGenericArguments()[0] == typeof(ApplicationDbContext)))
                .ToList();

            foreach (var descriptor in descriptorsToRemove)
            {
                services.Remove(descriptor);
            }
            services.RemoveAll<Application.Interfaces.Persistence.IApplicationDbContext>();

            // 6. Re-register ApplicationDbContext using the Testcontainer's connection string
            services.AddDbContext<Application.Interfaces.Persistence.IApplicationDbContext,
                                  ApplicationDbContext>(options =>
            {
                // Testcontainers maps a random available port on your host machine
                // GetConnectionString() automatically returns the correct, dynamic host/port combo.
                options.UseNpgsql(dbContainer.GetConnectionString());
            });
        });
    }
}
