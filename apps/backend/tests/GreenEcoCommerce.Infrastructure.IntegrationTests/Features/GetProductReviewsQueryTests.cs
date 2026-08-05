using GreenEcoCommerce.Application.Features.Reviews.Queries;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.ValueObjects;
using GreenEcoCommerce.Infrastructure.IntegrationTests.Shared;
using GreenEcoCommerce.Infrastructure.Persistence.Context;

namespace GreenEcoCommerce.Infrastructure.IntegrationTests.Features;

/// <summary>
/// Covers paging and visibility of the public product review list, plus the rating
/// aggregate that backs the star display.
/// </summary>
[Collection("PostgreSql")]
public class GetProductReviewsQueryTests(PostgreSqlFixture postgres)
{
    /// <summary>
    /// Seeds a product with <paramref name="ratings"/>.Length approved reviews, one per user,
    /// each created a minute apart so ordering is deterministic.
    /// </summary>
    private static async Task<Guid> SeedProductWithReviewsAsync(ApplicationDbContext db, params int[] ratings)
    {
        string unique = Guid.CreateVersion7().ToString("N");

        var category = new Category { Name = $"Eco Category {unique}" };

        var product = new Product
        {
            Name = $"Reusable Bottle {unique}",
            CategoryId = category.Id,
            Price = 12.00m,
            StockQty = 50,
            CarbonIndex = 2.00m,
            BaselineCarbonIndex = 5.00m
        };

        db.Categories.Add(category);
        db.Products.Add(product);

        var createdAt = DateTimeOffset.UtcNow.AddHours(-ratings.Length - 1);

        for (int i = 0; i < ratings.Length; i++)
        {
            var user = new User
            {
                Email = Email.From($"buyer.{i}.{unique}@greeneco.vn"),
                PasswordHash = "hashed-password",
                FirstName = "Buyer",
                LastName = $"No{i}",
                Phone = PhoneNumber.From("0912345678"),
                Address = "1 Green Street"
            };

            db.Users.Add(user);
            db.Reviews.Add(
                new Review
                {
                    UserId = user.Id,
                    ProductId = product.Id,
                    Rating = ratings[i],
                    Comment = $"Review number {i}",
                    IsApproved = true,
                    IsHidden = false,
                    CreatedAt = createdAt.AddMinutes(i)
                });
        }

        await db.SaveChangesAsync();

        return product.Id;
    }

    [Fact]
    public async Task Handle_ShouldReturnFirstPageOnly_WhenPageSizeIsSmallerThanTotal()
    {
        // Arrange
        await using var db = postgres.CreateDbContext();
        var productId = await SeedProductWithReviewsAsync(db, 5, 4, 3, 2, 1);

        var sut = new GetProductReviewsQuery.Handler(db);
        var query = new GetProductReviewsQuery(productId,
                                               new GetProductReviewsQuery.Parameters { PageNumber = 1, PageSize = 2 });

        // Act
        var result = await sut.Handle(query, TestContext.Current.CancellationToken);

        // Assert
        Assert.Equal(5, result.TotalCount);
        Assert.Equal(3, result.TotalPages);
        Assert.Equal(2, result.Items.Length);
    }

    [Fact]
    public async Task Handle_ShouldReturnNewestFirst_WhenSortIsNotSpecified()
    {
        // Arrange
        await using var db = postgres.CreateDbContext();
        var productId = await SeedProductWithReviewsAsync(db, 1, 2, 3);

        var sut = new GetProductReviewsQuery.Handler(db);

        // SortDescending is left null on purpose: that is what [AsParameters] binds when the
        // client omits the query string parameter.
        var query = new GetProductReviewsQuery(
            productId,
            new GetProductReviewsQuery.Parameters { PageNumber = 1, PageSize = 10, SortDescending = null });

        // Act
        var result = await sut.Handle(query, TestContext.Current.CancellationToken);

        // Assert - the last seeded review carries the newest CreatedAt
        Assert.Equal("Review number 2", result.Items[0].Comment);
        Assert.Equal("Review number 0", result.Items[^1].Comment);
    }

    [Fact]
    public async Task Handle_ShouldExcludeHiddenReviews()
    {
        // Arrange
        await using var db = postgres.CreateDbContext();
        var productId = await SeedProductWithReviewsAsync(db, 5, 4);

        var hiddenOwner = new User
        {
            Email = Email.From($"hidden.{Guid.CreateVersion7():N}@greeneco.vn"),
            PasswordHash = "hashed-password",
            FirstName = "Hidden",
            LastName = "Owner",
            Phone = PhoneNumber.From("0912345678"),
            Address = "2 Green Street"
        };

        db.Users.Add(hiddenOwner);
        db.Reviews.Add(new Review
        {
            UserId = hiddenOwner.Id,
            ProductId = productId,
            Rating = 1,
            Comment = "Hidden by an admin",
            IsApproved = true,
            IsHidden = true,
            CreatedAt = DateTimeOffset.UtcNow
        });

        await db.SaveChangesAsync(TestContext.Current.CancellationToken);

        var sut = new GetProductReviewsQuery.Handler(db);
        var query = new GetProductReviewsQuery(productId,
                                               new GetProductReviewsQuery.Parameters { PageNumber = 1, PageSize = 10 });

        // Act
        var result = await sut.Handle(query, TestContext.Current.CancellationToken);

        // Assert
        Assert.Equal(2, result.TotalCount);
        Assert.DoesNotContain(result.Items, r => r.Comment == "Hidden by an admin");
    }
}
