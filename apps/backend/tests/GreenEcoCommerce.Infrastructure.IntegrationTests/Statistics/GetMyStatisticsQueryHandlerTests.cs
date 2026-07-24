using GreenEcoCommerce.Application.Features.Statistics.Queries;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Enums;
using GreenEcoCommerce.Domain.ValueObjects;
using GreenEcoCommerce.Infrastructure.IntegrationTests.Shared;
using GreenEcoCommerce.Infrastructure.Persistence.Context;

namespace GreenEcoCommerce.Infrastructure.IntegrationTests.Statistics;

/// <summary>
/// Integration tests for <see cref="GetMyStatisticsQuery.Handler"/> against a real
/// PostgreSQL container. Each test seeds its own user (unique id) so the shared
/// database stays isolated per test.
/// </summary>
[Collection("PostgreSql")]
public class GetMyStatisticsQueryHandlerTests(PostgreSqlFixture fixture)
{
    private sealed record OrderSpec(
        OrderStatusEnum Status,
        DateTimeOffset CreatedAt,
        decimal UnitPrice,
        int Quantity,
        decimal Discount = 0m,
        decimal UnitCo2Saved = 0m,
        PaymentStatusEnum? PaymentStatus = null);

    private static User NewUser() => new()
    {
        Email = Email.From($"stat-{Guid.NewGuid():N}@test.com"),
        PasswordHash = "hash",
        FirstName = "Test",
        LastName = "User",
        Phone = PhoneNumber.From("0901234567"),
        Address = "123 Test Street",
        CreatedAt = DateTimeOffset.UtcNow,
    };

    /// <summary>Seeds one user (with wallet 320/420) plus the given orders; returns the user id.</summary>
    private async Task<Guid> SeedUserAsync(params OrderSpec[] specs)
    {
        await using var ctx = fixture.CreateDbContext();

        var category = new Category { Name = $"Cat-{Guid.NewGuid():N}" };
        var product = new Product { CategoryId = category.Id, Name = "Test Product", Price = 100m };
        ctx.Categories.Add(category);
        ctx.Products.Add(product);

        var user = NewUser();
        user.GreenWallet = new GreenWallet { UserId = user.Id, Balance = 320, EarnedTotal = 420 };
        ctx.Users.Add(user);

        foreach (var spec in specs)
        {
            var orderId = Guid.CreateVersion7();
            var order = new Order
            {
                Id = orderId,
                UserId = user.Id,
                Status = spec.Status,
                DeliveryAddress = "addr",
                DiscountAmount = spec.Discount,
                CreatedAt = spec.CreatedAt,
                OrderItems = new List<OrderItem>
                {
                    new()
                    {
                        OrderId = orderId,
                        ProductId = product.Id,
                        Quantity = spec.Quantity,
                        UnitPrice = spec.UnitPrice,
                        UnitCo2Saved = spec.UnitCo2Saved,
                    },
                },
            };

            if (spec.PaymentStatus is { } paymentStatus)
            {
                order.Payment = new Payment
                {
                    OrderId = orderId,
                    Method = PaymentMethodEnum.Bank,
                    Status = paymentStatus,
                    Amount = spec.UnitPrice * spec.Quantity - spec.Discount,
                    TransactionRef = $"ref-{orderId:N}",
                };
            }

            ctx.Orders.Add(order);
        }

        await ctx.SaveChangesAsync();
        return user.Id;
    }

    private async Task<GetMyStatisticsQuery.Response> RunAsync(Guid userId, int months = 6)
    {
        await using var ctx = fixture.CreateDbContext();
        var handler = new GetMyStatisticsQuery.Handler(ctx);
        return await handler.Handle(new GetMyStatisticsQuery(userId, months), CancellationToken.None);
    }

    [Fact]
    public async Task TotalSpending_ExcludesCancelledOrders()
    {
        var now = DateTimeOffset.UtcNow;
        var userId = await SeedUserAsync(
            new OrderSpec(OrderStatusEnum.Delivered, now, UnitPrice: 100m, Quantity: 2),   // 200
            new OrderSpec(OrderStatusEnum.Cancelled, now, UnitPrice: 100m, Quantity: 5));  // 500, excluded

        var result = await RunAsync(userId);

        Assert.Equal(200m, result.Summary.TotalSpending);
    }

    [Fact]
    public async Task PaidPlusPending_EqualsTotalSpending()
    {
        var now = DateTimeOffset.UtcNow;
        var userId = await SeedUserAsync(
            new OrderSpec(OrderStatusEnum.Delivered, now, 100m, 2, PaymentStatus: PaymentStatusEnum.Paid),   // paid 200
            new OrderSpec(OrderStatusEnum.Pending, now, 150m, 1, PaymentStatus: PaymentStatusEnum.Pending),  // pending 150
            new OrderSpec(OrderStatusEnum.Cancelled, now, 100m, 9));                                          // excluded

        var result = await RunAsync(userId);

        Assert.Equal(200m, result.Summary.PaidSpending);
        Assert.Equal(150m, result.Summary.PendingSpending);
        Assert.Equal(350m, result.Summary.TotalSpending);
        Assert.Equal(result.Summary.TotalSpending, result.Summary.PaidSpending + result.Summary.PendingSpending);
    }

    [Fact]
    public async Task RefundPendingSpending_CountsOnlyCancelledAndPaid()
    {
        var now = DateTimeOffset.UtcNow;
        var userId = await SeedUserAsync(
            new OrderSpec(OrderStatusEnum.Cancelled, now, 35m, 1, PaymentStatus: PaymentStatusEnum.Paid),   // refund 35
            new OrderSpec(OrderStatusEnum.Cancelled, now, 50m, 1),                                          // cancelled, unpaid → no
            new OrderSpec(OrderStatusEnum.Delivered, now, 70m, 1, PaymentStatus: PaymentStatusEnum.Paid));  // paid, not cancelled → no

        var result = await RunAsync(userId);

        Assert.Equal(35m, result.Summary.RefundPendingSpending);
        // Refund money must NOT leak into TotalSpending (only the Delivered 70 counts).
        Assert.Equal(70m, result.Summary.TotalSpending);
    }

    [Fact]
    public async Task Handler_FiltersByUserId_DoesNotMixOtherUsersOrders()
    {
        var now = DateTimeOffset.UtcNow;
        var userA = await SeedUserAsync(new OrderSpec(OrderStatusEnum.Delivered, now, 100m, 2)); // 200
        await SeedUserAsync(new OrderSpec(OrderStatusEnum.Delivered, now, 999m, 3));             // other user

        var result = await RunAsync(userA);

        Assert.Equal(1, result.Summary.TotalOrders);
        Assert.Equal(200m, result.Summary.TotalSpending);
        Assert.Equal(320, result.Summary.CurrentPoints);
        Assert.Equal(420, result.Summary.LifetimePoints);
    }

    [Theory]
    [InlineData(3)]
    [InlineData(6)]
    [InlineData(12)]
    public async Task MonthlySpending_HasOneEntryPerRequestedMonth(int months)
    {
        var now = DateTimeOffset.UtcNow;
        var userId = await SeedUserAsync(
            new OrderSpec(OrderStatusEnum.Delivered, now, 100m, 1),
            new OrderSpec(OrderStatusEnum.Delivered, now.AddMonths(-2), 100m, 1));

        var result = await RunAsync(userId, months);

        Assert.Equal(months, result.MonthlySpending.Count);
    }
}