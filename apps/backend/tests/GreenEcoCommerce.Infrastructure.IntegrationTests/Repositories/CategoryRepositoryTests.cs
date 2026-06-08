using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Infrastructure.IntegrationTests.Shared;
using GreenEcoCommerce.Infrastructure.Persistence.Context;
using GreenEcoCommerce.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Infrastructure.IntegrationTests.Repositories;

/// <summary>
/// Integration tests for <see cref="CategoryRepository"/> against a real
/// PostgreSQL instance managed by Testcontainers.
///
/// Design decisions
/// ----------------
/// • A <see cref="PostgreSqlFixture"/> is shared across the entire collection so
///   the container starts only once (fast suite execution).
/// • Each test creates its own <see cref="ApplicationDbContext"/> and disposes it
///   afterwards – this guarantees a clean EF change-tracker and avoids test
///   pollution via cached entities.
/// • The <see cref="IAsyncLifetime.InitializeAsync"/> implementation truncates the
///   categories table before every test so tests remain independent even though
///   they all talk to the same schema.
/// </summary>
[Collection("PostgreSql")]
public sealed class CategoryRepositoryTests(PostgreSqlFixture fixture) : IAsyncLifetime
{
    // ---------------------------------------------------------------------------
    // Per-test lifecycle – truncate the table so tests don't bleed into each other
    // ---------------------------------------------------------------------------

    public async ValueTask InitializeAsync()
    {
        await using var ctx = fixture.CreateDbContext();
        // ExecuteDeleteAsync on the whole table is the fastest way to clear rows.
        await ctx.Categories.ExecuteDeleteAsync();
    }

    public ValueTask DisposeAsync() => ValueTask.CompletedTask;

    // ---------------------------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------------------------

    private (ApplicationDbContext ctx, CategoryRepository repo) CreateSut()
    {
        var ctx = fixture.CreateDbContext();
        var repo = new CategoryRepository(ctx);
        return (ctx, repo);
    }

    private static Category MakeCategory(string name = "Electronics", string? description = "Electronic goods", Guid? parentId = null)
        => new() { Name = name, Description = description, ParentId = parentId };

    // ---------------------------------------------------------------------------
    // AddAsync
    // ---------------------------------------------------------------------------

    [Fact]
    public async Task AddAsync_ShouldPersistCategory_ToDatabase()
    {
        // Arrange
        var (ctx, repo) = CreateSut();
        await using var _ = ctx;
        var category = MakeCategory("Furniture");

        // Act
        await repo.AddAsync(category, CancellationToken.None);

        // Assert – re-query with a fresh context to bypass EF cache
        await using var verifyCtx = fixture.CreateDbContext();
        var persisted = await verifyCtx.Categories.FindAsync([category.Id], TestContext.Current.CancellationToken);
        Assert.NotNull(persisted);
        Assert.Equal("Furniture", persisted.Name);
    }

    [Fact]
    public async Task AddAsync_ShouldReturnCategoryWithSameId()
    {
        // Arrange
        var (ctx, repo) = CreateSut();
        await using var _ = ctx;
        var category = MakeCategory("Books");
        var expectedId = category.Id;

        // Act
        var result = await repo.AddAsync(category, CancellationToken.None);

        // Assert
        Assert.Equal(expectedId, result.Id);
    }

    [Fact]
    public async Task AddAsync_ShouldSupportParentChildRelationship()
    {
        // Arrange
        var (ctx, repo) = CreateSut();
        await using var _ = ctx;

        var parent = MakeCategory("Clothing");
        await repo.AddAsync(parent, CancellationToken.None);

        var child = MakeCategory("Men's Wear", "Men's clothing section", parent.Id);

        // Act
        var result = await repo.AddAsync(child, CancellationToken.None);

        // Assert
        await using var verifyCtx = fixture.CreateDbContext();
        var persistedChild = await verifyCtx.Categories.FindAsync([result.Id], TestContext.Current.CancellationToken);
        Assert.NotNull(persistedChild);
        Assert.Equal(parent.Id, persistedChild.ParentId);
    }

    // ---------------------------------------------------------------------------
    // GetByIdAsync
    // ---------------------------------------------------------------------------

    [Fact]
    public async Task GetByIdAsync_ShouldReturnCategory_WhenExists()
    {
        // Arrange
        var (ctx, repo) = CreateSut();
        await using var _ = ctx;
        var category = MakeCategory("Sports");
        await repo.AddAsync(category, CancellationToken.None);

        // Act – use a fresh context to bypass EF first-level cache
        var (ctx2, repo2) = CreateSut();
        await using var __ = ctx2;
        var result = await repo2.GetByIdAsync(category.Id, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(category.Id, result.Id);
        Assert.Equal("Sports", result.Name);
    }

    [Fact]
    public async Task GetByIdAsync_ShouldReturnNull_WhenNotExists()
    {
        // Arrange
        var (ctx, repo) = CreateSut();
        await using var _ = ctx;
        var nonExistentId = Guid.NewGuid();

        // Act
        var result = await repo.GetByIdAsync(nonExistentId, CancellationToken.None);

        // Assert
        Assert.Null(result);
    }

    // ---------------------------------------------------------------------------
    // GetAllAsync
    // ---------------------------------------------------------------------------

    [Fact]
    public async Task GetAllAsync_ShouldReturnAllCategories()
    {
        // Arrange
        var (ctx, repo) = CreateSut();
        await using var _ = ctx;
        await repo.AddAsync(MakeCategory("Category A"), CancellationToken.None);
        await repo.AddAsync(MakeCategory("Category B"), CancellationToken.None);
        await repo.AddAsync(MakeCategory("Category C"), CancellationToken.None);

        // Act
        var (ctx2, repo2) = CreateSut();
        await using var __ = ctx2;
        var result = await repo2.GetAllAsync(CancellationToken.None);

        // Assert
        Assert.Equal(3, result.Count);
    }

    [Fact]
    public async Task GetAllAsync_ShouldReturnEmptyList_WhenNoCategoriesExist()
    {
        // Arrange – table is already cleared by InitializeAsync
        var (ctx, repo) = CreateSut();
        await using var _ = ctx;

        // Act
        var result = await repo.GetAllAsync(CancellationToken.None);

        // Assert
        Assert.Empty(result);
    }

    // ---------------------------------------------------------------------------
    // UpdateAsync
    // ---------------------------------------------------------------------------

    [Fact]
    public async Task UpdateAsync_ShouldReturnTrue_WhenCategoryExists()
    {
        // Arrange
        var (ctx, repo) = CreateSut();
        await using var _ = ctx;
        var category = MakeCategory("Toys");
        await repo.AddAsync(category, CancellationToken.None);

        // Act
        var updated = new Category { Id = category.Id, Name = "Toys & Games", Description = "Updated" };
        var (ctx2, repo2) = CreateSut();
        await using var __ = ctx2;
        var result = await repo2.UpdateAsync(updated, CancellationToken.None);

        // Assert
        Assert.True(result);
    }

    [Fact]
    public async Task UpdateAsync_ShouldReturnFalse_WhenCategoryDoesNotExist()
    {
        // Arrange
        var (ctx, repo) = CreateSut();
        await using var _ = ctx;
        var ghost = new Category { Id = Guid.NewGuid(), Name = "Ghost", Description = "Does not exist" };

        // Act
        var result = await repo.UpdateAsync(ghost, CancellationToken.None);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public async Task UpdateAsync_ShouldUpdateFields_WhenCategoryExists()
    {
        // Arrange
        var (ctx, repo) = CreateSut();
        await using var _ = ctx;
        var category = MakeCategory("Old Name", "Old Description");
        await repo.AddAsync(category, CancellationToken.None);

        var updatedCategory = new Category
        {
            Id = category.Id,
            Name = "New Name",
            Description = "New Description",
            ParentId = null
        };

        // Act
        var (ctx2, repo2) = CreateSut();
        await using var __ = ctx2;
        await repo2.UpdateAsync(updatedCategory, CancellationToken.None);

        // Assert – query with a third fresh context
        await using var verifyCtx = fixture.CreateDbContext();
        var persisted = await verifyCtx.Categories.FindAsync([category.Id], TestContext.Current.CancellationToken);
        Assert.NotNull(persisted);
        Assert.Equal("New Name", persisted.Name);
        Assert.Equal("New Description", persisted.Description);
    }

    // ---------------------------------------------------------------------------
    // DeleteAsync
    // ---------------------------------------------------------------------------

    [Fact]
    public async Task DeleteAsync_ShouldRemoveCategory_FromDatabase()
    {
        // Arrange
        var (ctx, repo) = CreateSut();
        await using var _ = ctx;
        var category = MakeCategory("To Delete");
        await repo.AddAsync(category, CancellationToken.None);

        // Act
        var (ctx2, repo2) = CreateSut();
        await using var __ = ctx2;
        await repo2.DeleteAsync(category.Id, CancellationToken.None);

        // Assert
        await using var verifyCtx = fixture.CreateDbContext();
        var persisted = await verifyCtx.Categories.FindAsync([category.Id], TestContext.Current.CancellationToken);
        Assert.Null(persisted);
    }

    [Fact]
    public async Task DeleteAsync_ShouldNotThrow_WhenCategoryDoesNotExist()
    {
        // Arrange
        var (ctx, repo) = CreateSut();
        await using var _ = ctx;
        var nonExistentId = Guid.NewGuid();

        // Act & Assert – must complete without exception
        var exception = await Record.ExceptionAsync(
            () => repo.DeleteAsync(nonExistentId, CancellationToken.None));
        Assert.Null(exception);
    }
}
