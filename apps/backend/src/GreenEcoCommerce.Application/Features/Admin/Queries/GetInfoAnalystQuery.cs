using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Application.Queries;
using GreenEcoCommerce.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Admin.Queries;

public record GetInfoAnalystQuery(int Month, int Year) : IRequest<GetInfoAnalystQuery.Response>
{
    public record Response(Revenue TotalRevenue, Orders AmountOrders, Users AmountUsers, Co2Saved TotalCo2Saved);

    public record Revenue(decimal CurrentValue, decimal PreviousValue, decimal GrowthPercentage, bool IsGrowth);

    public record Orders(int CurrentValue, int PreviousValue, decimal GrowthPercentage, bool IsGrowth);

    public record Users(int CurrentValue, int PreviousValue, decimal GrowthPercentage, bool IsGrowth);

    public record Co2Saved(decimal CurrentValue, decimal PreviousValue, float GrowthPercentage, bool IsGrowth);

    public class Handler(IApplicationDbContext dbContext) : IRequestHandler<GetInfoAnalystQuery, Response>
    {
        public async Task<Response> Handle(GetInfoAnalystQuery request, CancellationToken ct)
        {
            // Kỳ hiện tại là tháng được yêu cầu, kỳ trước là tháng liền kề trước đó.
            // Phải dựng bằng DateTimeOffset UTC (offset 0) ngay từ đầu: User.CreatedAt/
            // Payment.CreatedAt là DateTimeOffset (cột timestamptz), còn nếu so sánh với
            // DateTime thường thì C# tự convert ngầm sang DateTimeOffset theo local timezone
            // của máy chạy — Npgsql từ chối ghi tham số DateTimeOffset có offset khác 0 vào
            // timestamptz ("only offset 0 (UTC) is supported"), gây 500 ngay khi ToListAsync.
            var periodStart = new DateTimeOffset(request.Year, request.Month, 1, 0, 0, 0, TimeSpan.Zero);
            var periodEnd = periodStart.AddMonths(1);
            var previousPeriod = periodStart.AddMonths(-1);
            int previousMonth = previousPeriod.Month;
            int previousYear = previousPeriod.Year;

            // Lọc theo khoảng [previousPeriod, periodEnd) ngay trong LINQ Where để EF Core
            // dịch thành SQL WHERE, thay vì kéo toàn bộ user/order về rồi lọc bằng C# foreach.
            // Orders/OrderItems không bật lazy loading nên bắt buộc phải Include,
            // nếu không mọi chỉ số theo đơn hàng đều bằng 0.
            var orders = await dbContext.Orders
                .Where(o => !o.User.IsDeleted
                    && o.Payment != null
                    && o.Payment.Status == PaymentStatusEnum.Paid
                    && o.Payment.CreatedAt >= previousPeriod
                    && o.Payment.CreatedAt < periodEnd)
                .Include(o => o.Payment)
                .Include(o => o.OrderItems)
                .ToListAsync(ct);

            var users = await dbContext.Users
                .IsNotDeleted()
                .Where(u => u.CreatedAt >= previousPeriod && u.CreatedAt < periodEnd)
                .ToListAsync(ct);

            decimal currentRevenue = 0m;
            int currentOrders = 0;
            int currentUsers = 0;
            decimal currentCo2Saved = 0m;

            decimal previousRevenue = 0m;
            int previousOrders = 0;
            int previousUsers = 0;
            decimal previousCo2Saved = 0m;

            foreach (var o in orders)
            {
                int month = o.Payment!.CreatedAt.Month;
                int year = o.Payment.CreatedAt.Year;

                decimal co2Saved = o.OrderItems.Sum(oi => oi.UnitCo2Saved * oi.Quantity);

                if (month == request.Month && year == request.Year)
                {
                    currentRevenue += o.Payment.Amount;
                    currentOrders++;
                    currentCo2Saved += co2Saved;
                }

                if (month == previousMonth && year == previousYear)
                {
                    previousRevenue += o.Payment.Amount;
                    previousOrders++;
                    previousCo2Saved += co2Saved;
                }
            }

            foreach (var u in users)
            {
                int month = u.CreatedAt.Month;
                int year = u.CreatedAt.Year;

                if (month == request.Month && year == request.Year) currentUsers++;

                if (month == previousMonth && year == previousYear) previousUsers++;
            }

            decimal revenueGrowth;

            if (previousRevenue != 0) { revenueGrowth = (currentRevenue - previousRevenue) / previousRevenue * 100; }
            else { revenueGrowth = 100m; }

            bool isRevenueGrowth = currentRevenue > previousRevenue;
            var revenueRecord = new Revenue(currentRevenue, previousRevenue, revenueGrowth, isRevenueGrowth);

            decimal ordersGrowth;

            if (previousOrders != 0)
            {
                ordersGrowth = (decimal)(currentOrders - previousOrders) / previousOrders * 100;
            }
            else { ordersGrowth = 100m; }

            bool isOrdersGrowth = currentOrders > previousOrders;
            var ordersRecord = new Orders(currentOrders, previousOrders, ordersGrowth, isOrdersGrowth);

            decimal usersGrowth;

            if (previousUsers != 0) { usersGrowth = (decimal)(currentUsers - previousUsers) / previousUsers * 100; }
            else { usersGrowth = 100m; }

            bool isUsersGrowth = currentUsers > previousUsers;
            var usersRecord = new Users(currentUsers, previousUsers, usersGrowth, isUsersGrowth);

            float co2Growth;

            if (previousCo2Saved != 0)
            {
                co2Growth = (float)(currentCo2Saved - previousCo2Saved) / (float)previousCo2Saved * 100;
            }
            else { co2Growth = 100; }

            bool isCo2Growth = currentCo2Saved > previousCo2Saved;
            var co2SavedRecord = new Co2Saved(currentCo2Saved, previousCo2Saved, co2Growth, isCo2Growth);

            var response = new Response(
                TotalRevenue: revenueRecord,
                AmountOrders: ordersRecord,
                AmountUsers: usersRecord,
                TotalCo2Saved: co2SavedRecord);

            return response;
        }
    }
}
