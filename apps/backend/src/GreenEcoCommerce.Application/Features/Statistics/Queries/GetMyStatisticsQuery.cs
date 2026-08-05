using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Statistics.Queries;

public record GetMyStatisticsQuery(Guid UserId, int Months = 6) : IRequest<GetMyStatisticsQuery.Response>
{
    public record Response(
        Summary Summary,
        IReadOnlyList<MonthlyPoint> MonthlySpending,
        IReadOnlyList<CategorySlice> CategoryBreakdown,
        IReadOnlyList<StatusSlice> StatusBreakdown);

    /// <param name="TotalSpending">Σ(UnitPrice × Quantity) − Discount cho đơn không Cancelled (KPI chính).</param>
    /// <param name="PaidSpending">Phần của TotalSpending thuộc các đơn không Cancelled đã thanh toán (Paid).</param>
    /// <param name="PendingSpending">Phần của TotalSpending thuộc các đơn không Cancelled chưa thanh toán (vd COD). PaidSpending + PendingSpending = TotalSpending.</param>
    /// <param name="RefundPendingSpending">Σ Payment.Amount của các đơn ĐÃ huỷ nhưng đã thanh toán (Paid) — tiền chờ hoàn. Không nằm trong TotalSpending.</param>
    /// <param name="TotalCo2Saved">Σ(UnitCo2Saved × Quantity) cho đơn không Cancelled, đơn vị kg.</param>
    public record Summary(
        int TotalOrders,
        decimal TotalSpending,
        decimal PaidSpending,
        decimal PendingSpending,
        decimal RefundPendingSpending,
        decimal TotalCo2Saved,
        int CurrentPoints,
        int LifetimePoints);

    public record MonthlyPoint(int Year, int Month, string Label, decimal Amount, decimal Co2Saved);

    public record CategorySlice(string Category, decimal Amount, int Quantity);

    public record StatusSlice(OrderStatusEnum Status, int Count);

    public class Handler(IApplicationDbContext dbContext) : IRequestHandler<GetMyStatisticsQuery, Response>
    {
        private const int MinMonths = 1;
        private const int MaxMonths = 24;

        public async Task<Response> Handle(GetMyStatisticsQuery request, CancellationToken ct)
        {
            int months = Math.Clamp(request.Months, MinMonths, MaxMonths);

            var orders = await dbContext.Orders
                .AsNoTracking()
                .Where(o => o.UserId == request.UserId)
                .Include(o => o.Payment)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .ThenInclude(p => p.Category)
                .ToListAsync(ct);

            var wallet = await dbContext.GreenWallets
                .AsNoTracking()
                .Where(w => w.UserId == request.UserId)
                .Select(w => new { w.Balance, w.EarnedTotal })
                .FirstOrDefaultAsync(ct);

            var completedOrders = orders
                .Where(o => o.Status != OrderStatusEnum.Cancelled)
                .ToList();

            decimal OrderTotal(Domain.Entities.Order o) =>
                o.OrderItems.Sum(oi => oi.UnitPrice * oi.Quantity) - o.DiscountAmount;

            decimal OrderCo2(Domain.Entities.Order o) =>
                o.OrderItems.Sum(oi => oi.UnitCo2Saved * oi.Quantity);

            // Partition non-cancelled orders into paid vs not-yet-paid so the two
            // sub-totals always add up to TotalSpending (no paid-but-cancelled leakage).
            var paidOrders = completedOrders
                .Where(o => o.Payment is { Status: PaymentStatusEnum.Paid })
                .ToList();
            var pendingOrders = completedOrders
                .Where(o => o.Payment is not { Status: PaymentStatusEnum.Paid })
                .ToList();

            // Money already paid for orders that were later cancelled — pending refund.
            // Kept out of TotalSpending on purpose; surfaced separately so it is not lost.
            decimal refundPendingSpending = orders
                .Where(o => o.Status == OrderStatusEnum.Cancelled && o.Payment is { Status: PaymentStatusEnum.Paid })
                .Sum(o => o.Payment!.Amount);

            var summary = new Summary(
                TotalOrders: orders.Count,
                TotalSpending: completedOrders.Sum(OrderTotal),
                PaidSpending: paidOrders.Sum(OrderTotal),
                PendingSpending: pendingOrders.Sum(OrderTotal),
                RefundPendingSpending: refundPendingSpending,
                TotalCo2Saved: completedOrders.Sum(OrderCo2),
                CurrentPoints: wallet?.Balance ?? 0,
                LifetimePoints: wallet?.EarnedTotal ?? 0);

            var now = DateTimeOffset.UtcNow;
            var monthlySpending = Enumerable.Range(0, months)
                .Select(offset => now.AddMonths(-(months - 1 - offset)))
                .Select(bucket =>
                {
                    var inBucket = completedOrders
                        .Where(o => o.CreatedAt.Year == bucket.Year && o.CreatedAt.Month == bucket.Month)
                        .ToList();

                    return new MonthlyPoint(
                        Year: bucket.Year,
                        Month: bucket.Month,
                        Label: $"{bucket.Month:D2}/{bucket.Year}",
                        Amount: inBucket.Sum(OrderTotal),
                        Co2Saved: inBucket.Sum(OrderCo2));
                })
                .ToList();

            var categoryBreakdown = completedOrders
                .SelectMany(o => o.OrderItems)
                .GroupBy(oi => oi.Product.Category.Name)
                .Select(g => new CategorySlice(
                    Category: g.Key,
                    Amount: g.Sum(oi => oi.UnitPrice * oi.Quantity),
                    Quantity: g.Sum(oi => oi.Quantity)))
                .OrderByDescending(slice => slice.Amount)
                .ToList();

            var statusBreakdown = orders
                .GroupBy(o => o.Status)
                .Select(g => new StatusSlice(g.Key, g.Count()))
                .OrderBy(slice => slice.Status)
                .ToList();

            return new Response(summary, monthlySpending, categoryBreakdown, statusBreakdown);
        }
    }
}