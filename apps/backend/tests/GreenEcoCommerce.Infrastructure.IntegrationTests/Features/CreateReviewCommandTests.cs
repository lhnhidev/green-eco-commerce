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
/// Covers the business rules guarding review creation: only a customer who received the
/// product may review it, an unknown product is a 404, and a second submission from the
/// same customer edits the first one instead of creating a duplicate.
/// </summary>
[Collection("PostgreSql")]
public class CreateReviewCommandTests(PostgreSqlFixture postgres)
{
    /// <summary>
    /// Seeds an isolated category + product + user. When <paramref name="withOrder"/> is
    /// <c>true</c> the user also gets an order containing that product.
    /// </summary>
    private static async Task<(Guid UserId, Guid ProductId)> SeedAsync(ApplicationDbContext db, bool withOrder,
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

        if (withOrder)
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

    [Fact]
    public async Task Handle_ShouldCreateApprovedReview_WhenUserPurchasedAndReceivedTheProduct()
    {
        // Arrange
        await using var db = postgres.CreateDbContext();
        var (userId, productId) = await SeedAsync(db, withOrder: true);

        var sut = new CreateReviewCommand.Handler(db);
        var command = new CreateReviewCommand(productId, userId, new ReviewPayloadDto(5, "Excellent product!"));

        // Act
        var result = await sut.Handle(command, TestContext.Current.CancellationToken);

        // Assert
        Assert.Equal(productId, result.ProductId);
        Assert.Equal(userId, result.UserId);
        Assert.Equal(5, result.Rating);
        Assert.Equal("Excellent product!", result.Comment);
        Assert.Equal("Nguyen Van A", result.UserName);

        // CreatedAt is deliberately not asserted: AuditingInterceptor stamps it, and the fixture
        // builds its DbContext without interceptors, so it stays default here but not in the app.

        await using var verifyDb = postgres.CreateDbContext();
        var persisted = await verifyDb.Reviews.SingleAsync(
            r => r.UserId == userId && r.ProductId == productId, TestContext.Current.CancellationToken);

        Assert.Equal(5, persisted.Rating);

        // The purchase check stands in for moderation, so the review is visible immediately
        Assert.True(persisted.IsApproved);
        Assert.False(persisted.IsHidden);
    }

    [Fact]
    public async Task Handle_ShouldThrowForbidden_WhenUserNeverPurchasedTheProduct()
    {
        // Arrange
        await using var db = postgres.CreateDbContext();
        var (userId, productId) = await SeedAsync(db, withOrder: false);

        var sut = new CreateReviewCommand.Handler(db);
        var command = new CreateReviewCommand(productId, userId, new ReviewPayloadDto(4, "Looks nice."));

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
        var (userId, productId) = await SeedAsync(db, withOrder: true, status: OrderStatusEnum.Delivering);

        var sut = new CreateReviewCommand.Handler(db);
        var command = new CreateReviewCommand(productId, userId, new ReviewPayloadDto(4, "Shipped but not here yet."));

        // Act & Assert
        await Assert.ThrowsAsync<ForbiddenException>(
            () => sut.Handle(command, TestContext.Current.CancellationToken));
    }

    [Fact]
    public async Task Handle_ShouldUpdateExistingReview_WhenUserReviewsTheSameProductTwice()
    {
        // Arrange
        await using var db = postgres.CreateDbContext();
        var (userId, productId) = await SeedAsync(db, withOrder: true);

        var sut = new CreateReviewCommand.Handler(db);
        var first = await sut.Handle(
            new CreateReviewCommand(productId, userId, new ReviewPayloadDto(5, "First review")),
            TestContext.Current.CancellationToken);

        // Act - a second submission edits the review rather than being rejected
        var second = await sut.Handle(
            new CreateReviewCommand(productId, userId, new ReviewPayloadDto(1, "Changed my mind")),
            TestContext.Current.CancellationToken);

        // Assert
        Assert.Equal(first.Id, second.Id);
        Assert.Equal(1, second.Rating);
        Assert.Equal("Changed my mind", second.Comment);

        await using var verifyDb = postgres.CreateDbContext();
        Assert.Equal(
            1,
            await verifyDb.Reviews.CountAsync(r => r.UserId == userId && r.ProductId == productId,
                                              TestContext.Current.CancellationToken));
    }

    [Fact]
    public async Task Handle_ShouldThrowNotFound_WhenProductDoesNotExist()
    {
        // Arrange
        await using var db = postgres.CreateDbContext();
        var (userId, _) = await SeedAsync(db, withOrder: true);

        var sut = new CreateReviewCommand.Handler(db);
        var command = new CreateReviewCommand(Guid.CreateVersion7(), userId, new ReviewPayloadDto(5, "Ghost product"));

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(
            () => sut.Handle(command, TestContext.Current.CancellationToken));
    }
}