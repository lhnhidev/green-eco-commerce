using GreenEcoCommerce.Application.Features.Reviews;
using GreenEcoCommerce.Application.Features.Reviews.Commands;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Enums;
using GreenEcoCommerce.Domain.Exceptions;
using GreenEcoCommerce.Domain.ValueObjects;
using GreenEcoCommerce.Infrastructure.IntegrationTests.Shared;
using GreenEcoCommerce.Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Infrastructure.IntegrationTests.Features;

/// <summary>
/// Covers the acceptance criteria of the "Product Reviews &amp; Ratings" issue:
/// TC_REVIEW_01 (purchaser can review), TC_REVIEW_02 (non-purchaser is forbidden)
/// and TC_REVIEW_03 (a second review for the same product conflicts).
/// </summary>
[Collection("PostgreSql")]
public class CreateReviewCommandTests(PostgreSqlFixture postgres)
{
    // ── Helpers ──────────────────────────────────────────────────────────────

    /// <summary>
    /// Seeds an isolated category + product + user. When <paramref name="deliveredOrder"/> is
    /// <c>true</c> the user also gets an order containing that product.
    /// </summary>
    private static async Task<(Guid UserId, Guid ProductId)> SeedAsync(ApplicationDbContext db, bool deliveredOrder,
                                                                       OrderStatusEnum status =
                                                                               OrderStatusEnum.Delivered)
    {
        string unique = Guid.CreateVersion7().ToString("N");

        var category = new Category { Name = $"Eco Category {unique}" };

        var product = new Product
        {
            Name = $"Bamboo Toothbrush {unique}",
            CategoryId = category.Id,
            Price = 4.50m,
            StockQty = 100,
            CarbonIndex = 1.20m,
            BaselineCarbonIndex = 3.40m
        };

        var user = new User
        {
            Email = Email.From($"reviewer.{unique}@greeneco.vn"),
            PasswordHash = "hashed-password",
            FirstName = "Nguyen",
            LastName = "Van A",
            Phone = PhoneNumber.From("0912345678"),
            Address = "123 Green Street"
        };

        db.Categories.Add(category);
        db.Products.Add(product);
        db.Users.Add(user);

        if (deliveredOrder)
        {
            var order = new Order
            {
                UserId = user.Id,
                Status = status,
                DeliveryAddress = "123 Green Street"
            };

            order.OrderItems.Add(
                new OrderItem
                {
                    OrderId = order.Id,
                    ProductId = product.Id,
                    Quantity = 1,
                    UnitPrice = product.Price,
                    UnitCo2Saved = 2.20m
                });

            db.Orders.Add(order);
        }

        await db.SaveChangesAsync();

        return (user.Id, product.Id);
    }

    // ── TC_REVIEW_01 ─────────────────────────────────────────────────────────

    [Fact]
    public async Task Handle_ShouldCreateReview_WhenUserPurchasedAndReceivedTheProduct()
    {
        // Arrange
        await using var db = postgres.CreateDbContext();
        var (userId, productId) = await SeedAsync(db, deliveredOrder: true);

        var sut = new CreateReviewCommand.Handler(db);
        var command = new CreateReviewCommand(productId, userId, new CreateReviewPayloadDto(5, "Excellent product!"));

        // Act
        var result = await sut.Handle(command, TestContext.Current.CancellationToken);

        // Assert
        Assert.Equal(productId, result.ProductId);
        Assert.Equal(userId, result.UserId);
        Assert.Equal(5, result.Rating);
        Assert.Equal("Excellent product!", result.Comment);
        Assert.Equal("Nguyen Van A", result.UserFullName);
        Assert.NotEqual(default, result.CreatedAt);

        await using var verifyDb = postgres.CreateDbContext();
        var persisted = await verifyDb.Reviews.SingleAsync(
            r => r.UserId == userId && r.ProductId == productId, TestContext.Current.CancellationToken);

        Assert.Equal(5, persisted.Rating);
        Assert.True(persisted.IsApproved);
    }

    // ── TC_REVIEW_02 ─────────────────────────────────────────────────────────

    [Fact]
    public async Task Handle_ShouldThrowForbidden_WhenUserNeverPurchasedTheProduct()
    {
        // Arrange
        await using var db = postgres.CreateDbContext();
        var (userId, productId) = await SeedAsync(db, deliveredOrder: false);

        var sut = new CreateReviewCommand.Handler(db);
        var command = new CreateReviewCommand(productId, userId, new CreateReviewPayloadDto(4, "Looks nice."));

        // Act & Assert
        await Assert.ThrowsAsync<ForbiddenException>(
            () => sut.Handle(command, TestContext.Current.CancellationToken));

        await using var verifyDb = postgres.CreateDbContext();
        Assert.False(
            await verifyDb.Reviews.AnyAsync(r => r.UserId == userId && r.ProductId == productId,
                                            TestContext.Current.CancellationToken));
    }

    [Fact]
    public async Task Handle_ShouldThrowForbidden_WhenOrderIsNotDeliveredYet()
    {
        // Arrange
        await using var db = postgres.CreateDbContext();
        var (userId, productId) = await SeedAsync(db, deliveredOrder: true, status: OrderStatusEnum.Delivering);

        var sut = new CreateReviewCommand.Handler(db);
        var command = new CreateReviewCommand(productId, userId, new CreateReviewPayloadDto(4));

        // Act & Assert
        await Assert.ThrowsAsync<ForbiddenException>(
            () => sut.Handle(command, TestContext.Current.CancellationToken));
    }

    // ── TC_REVIEW_03 ─────────────────────────────────────────────────────────

    [Fact]
    public async Task Handle_ShouldThrowConflict_WhenUserAlreadyReviewedTheProduct()
    {
        // Arrange
        await using var db = postgres.CreateDbContext();
        var (userId, productId) = await SeedAsync(db, deliveredOrder: true);

        var sut = new CreateReviewCommand.Handler(db);
        await sut.Handle(new CreateReviewCommand(productId, userId, new CreateReviewPayloadDto(5, "First review")),
                         TestContext.Current.CancellationToken);

        // Act & Assert
        await Assert.ThrowsAsync<ConflictException>(
            () => sut.Handle(new CreateReviewCommand(productId, userId, new CreateReviewPayloadDto(1, "Second review")),
                             TestContext.Current.CancellationToken));

        await using var verifyDb = postgres.CreateDbContext();
        Assert.Equal(
            1,
            await verifyDb.Reviews.CountAsync(r => r.UserId == userId && r.ProductId == productId,
                                              TestContext.Current.CancellationToken));
    }

    // ── Product existence ────────────────────────────────────────────────────

    [Fact]
    public async Task Handle_ShouldThrowNotFound_WhenProductDoesNotExist()
    {
        // Arrange
        await using var db = postgres.CreateDbContext();
        var (userId, _) = await SeedAsync(db, deliveredOrder: true);

        var sut = new CreateReviewCommand.Handler(db);
        var command = new CreateReviewCommand(Guid.CreateVersion7(), userId, new CreateReviewPayloadDto(5));

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(
            () => sut.Handle(command, TestContext.Current.CancellationToken));
    }
}