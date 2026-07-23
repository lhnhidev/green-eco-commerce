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
            // Orders/Payment/OrderItems không bật lazy loading nên bắt buộc phải Include,
            // nếu không u.Orders luôn rỗng và mọi chỉ số theo đơn hàng đều bằng 0.
            var users = await dbContext.Users
                .IsNotDeleted()
                .Include(u => u.Orders).ThenInclude(o => o.Payment)
                .Include(u => u.Orders).ThenInclude(o => o.OrderItems)
                .ToListAsync(ct);

            var orders = users.SelectMany(u => u.Orders).ToList();

            decimal currentRevenue = 0m;
            int currentOrders = 0;
            int currentUsers = 0;
            decimal currentCo2Saved = 0m;

            decimal previousRevenue = 0m;
            int previousOrders = 0;
            int previousUsers = 0;
            decimal previousCo2Saved = 0m;

            // Kỳ hiện tại là tháng được yêu cầu, kỳ trước là tháng liền kề trước đó.
            var previousPeriod = new DateTime(request.Year, request.Month, 1).AddMonths(-1);
            int previousMonth = previousPeriod.Month;
            int previousYear = previousPeriod.Year;

            foreach (var o in orders)
            {
                if (o.Payment is null) continue;

                if (o.Payment.Status != PaymentStatusEnum.Paid) continue;

                int month = o.Payment.CreatedAt.Month;
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
