using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Enums;
using GreenEcoCommerce.Domain.ValueObjects;
using GreenEcoCommerce.Infrastructure.IntegrationTests.Shared;
using GreenEcoCommerce.Infrastructure.Persistence.Context;
using GreenEcoCommerce.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Infrastructure.IntegrationTests.Repositories;

/// <summary>
/// Integration tests for <see cref="UserRepository"/> against a real PostgreSQL
/// instance managed by Testcontainers.
///
/// Design decisions
/// ----------------
/// • The <see cref="PostgreSqlFixture"/> is shared so the container boots once.
/// • Each test creates its own <see cref="ApplicationDbContext"/> to keep the EF
///   change-tracker clean and prevent false positives caused by cached entities.
/// • <see cref="IAsyncLifetime.InitializeAsync"/> truncates the users table before
///   each test, guaranteeing full test isolation.
/// • Passwords are pre-hashed inline (using BCrypt) so the User entity receives a
///   valid password hash without pulling the Application layer into scope.
/// </summary>
[Collection("PostgreSql")]
public sealed class UserRepositoryTests(PostgreSqlFixture fixture) : IAsyncLifetime
{
    // ---------------------------------------------------------------------------
    // Per-test lifecycle
    // ---------------------------------------------------------------------------

    public async ValueTask InitializeAsync()
    {
        await using var ctx = fixture.CreateDbContext();
        await ctx.Users.ExecuteDeleteAsync();
    }

    public ValueTask DisposeAsync() => ValueTask.CompletedTask;

    // ---------------------------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------------------------

    private (ApplicationDbContext ctx, UserRepository repo) CreateSut()
    {
        var ctx = fixture.CreateDbContext();
        var repo = new UserRepository(ctx);
        return (ctx, repo);
    }

    /// <summary>
    /// Builds a unique, valid <see cref="User"/> for each test. All required
    /// fields are populated; email and phone must be unique across the table.
    /// </summary>
    private static User MakeUser(
        string email = "john.doe@example.com",
        string phone = "0311111110",
        string firstName = "John",
        string lastName = "Doe",
        string address = "123 Main Street",
        RoleEnum role = RoleEnum.User)
        => new(
            Email.From(email),
            BCrypt.Net.BCrypt.HashPassword("P@ssw0rd!"),
            firstName,
            lastName,
            PhoneNumber.From(phone),
            address,
            role);

    // ---------------------------------------------------------------------------
    // AddUserAsync
    // ---------------------------------------------------------------------------

    [Fact]
    public async Task AddUserAsync_ShouldPersistUser_ToDatabase()
    {
        // Arrange
        var (ctx, repo) = CreateSut();
        await using var _ = ctx;
        var user = MakeUser();

        // Act
        await repo.AddUserAsync(user);

        // Assert – verify via a second fresh context to bypass EF cache
        await using var verifyCtx = fixture.CreateDbContext();
        var persisted = await verifyCtx.Users.FindAsync([user.Id], TestContext.Current.CancellationToken);
        Assert.NotNull(persisted);
        Assert.Equal("john.doe@example.com", persisted.Email.Value);
        Assert.Equal("John", persisted.FirstName);
        Assert.Equal("Doe", persisted.LastName);
    }

    [Fact]
    public async Task AddUserAsync_ShouldReturnUserId()
    {
        // Arrange
        var (ctx, repo) = CreateSut();
        await using var _ = ctx;
        var user = MakeUser();
        var expectedId = user.Id;

        // Act
        var returnedId = await repo.AddUserAsync(user);

        // Assert
        Assert.Equal(expectedId, returnedId);
    }

    // ---------------------------------------------------------------------------
    // GetUserByEmailAsync
    // ---------------------------------------------------------------------------

    [Fact]
    public async Task GetUserByEmailAsync_ShouldReturnUser_WhenExists()
    {
        // Arrange
        var (ctx, repo) = CreateSut();
        await using var _ = ctx;
        var user = MakeUser("alice@example.com", "0312222220");
        await repo.AddUserAsync(user);

        // Act – fresh context
        var (ctx2, repo2) = CreateSut();
        await using var __ = ctx2;
        var result = await repo2.GetUserByEmailAsync("alice@example.com");

        // Assert
        Assert.NotNull(result);
        Assert.Equal("alice@example.com", result.Email.Value);
    }

    [Fact]
    public async Task GetUserByEmailAsync_ShouldReturnNull_WhenUserDoesNotExist()
    {
        // Arrange
        var (ctx, repo) = CreateSut();
        await using var _ = ctx;

        // Act
        var result = await repo.GetUserByEmailAsync("nobody@example.com");

        // Assert
        Assert.Null(result);
    }

    // ---------------------------------------------------------------------------
    // GetUserByIdAsync
    // ---------------------------------------------------------------------------

    [Fact]
    public async Task GetUserByIdAsync_ShouldReturnUser_WhenExists()
    {
        // Arrange
        var (ctx, repo) = CreateSut();
        await using var _ = ctx;
        var user = MakeUser("bob@example.com", "0313333330");
        await repo.AddUserAsync(user);

        // Act
        var (ctx2, repo2) = CreateSut();
        await using var __ = ctx2;
        var result = await repo2.GetUserByIdAsync(user.Id);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(user.Id, result.Id);
        Assert.Equal("bob@example.com", result.Email.Value);
    }

    [Fact]
    public async Task GetUserByIdAsync_ShouldReturnNull_WhenUserDoesNotExist()
    {
        // Arrange
        var (ctx, repo) = CreateSut();
        await using var _ = ctx;
        var nonExistentId = Guid.NewGuid();

        // Act
        var result = await repo.GetUserByIdAsync(nonExistentId);

        // Assert
        Assert.Null(result);
    }

    // ---------------------------------------------------------------------------
    // EmailUserExist
    // ---------------------------------------------------------------------------

    [Fact]
    public async Task EmailUserExist_ShouldReturnTrue_WhenEmailExists()
    {
        // Arrange
        var (ctx, repo) = CreateSut();
        await using var _ = ctx;
        var user = MakeUser("carol@example.com", "0314444440");
        await repo.AddUserAsync(user);

        // Act
        var (ctx2, repo2) = CreateSut();
        await using var __ = ctx2;
        var exists = await repo2.EmailUserExist("carol@example.com");

        // Assert
        Assert.True(exists);
    }

    [Fact]
    public async Task EmailUserExist_ShouldReturnFalse_WhenEmailDoesNotExist()
    {
        // Arrange – table is already empty from InitializeAsync
        var (ctx, repo) = CreateSut();
        await using var _ = ctx;

        // Act
        var exists = await repo.EmailUserExist("ghost@example.com");

        // Assert
        Assert.False(exists);
    }

    // ---------------------------------------------------------------------------
    // PhoneNumberUserExist
    // ---------------------------------------------------------------------------

    [Fact]
    public async Task PhoneNumberUserExist_ShouldReturnTrue_WhenPhoneExists()
    {
        // Arrange
        var (ctx, repo) = CreateSut();
        await using var _ = ctx;
        var user = MakeUser("dave@example.com", "0315555550");
        await repo.AddUserAsync(user);

        // Act
        var (ctx2, repo2) = CreateSut();
        await using var __ = ctx2;
        var exists = await repo2.PhoneNumberUserExist("0315555550");

        // Assert
        Assert.True(exists);
    }

    [Fact]
    public async Task PhoneNumberUserExist_ShouldReturnFalse_WhenPhoneDoesNotExist()
    {
        // Arrange – table is already empty from InitializeAsync
        var (ctx, repo) = CreateSut();
        await using var _ = ctx;

        // Act
        var exists = await repo.PhoneNumberUserExist("0318888880");

        // Assert
        Assert.False(exists);
    }
}
