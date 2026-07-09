using AutoMapper;
using GreenEcoCommerce.Domain.Enums;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Admin.Queries;

public record GetInfoAnalystQuery(int Month, int Year) : IRequest<GetInfoAnalystQueryResponse>;

public class GetInfoAnalystQueryHandler(IUserRepository userRepository, IMapper mapper) : IRequestHandler<GetInfoAnalystQuery, GetInfoAnalystQueryResponse>
{
    public async Task<GetInfoAnalystQueryResponse> Handle(GetInfoAnalystQuery request, CancellationToken cancellationToken)
    {
        var users = await userRepository.GetAllUsersAsync();
        var orders = users.SelectMany(u => u.Orders).ToList();

        var currentRevenue = 0m;
        var currentOrders = 0;
        var currentUsers = 0;
        var currentCo2Saved = 0f;

        var previousRevenue = 0m;
        var previousOrders = 0;
        var previousUsers = 0;
        var previousCo2Saved = 0f;

        var monthToday = DateTime.Today.Month;
        var yearToday = DateTime.Today.Year;

        foreach (var o in orders)
        {

            if (o.Payment is null)
                continue;

            if (o.Payment.Status != PaymentStatusEnum.Paid)
                continue;

            Console.WriteLine(o.Id);
            Console.WriteLine(o.OrderItems.Count);
            var month = o.Payment.CreatedAt.Month;
            var year = o.Payment.CreatedAt.Year;

            var co2Saved = o.OrderItems.Sum(oi => oi.UnitCo2Saved * oi.Quantity);

            if (month == monthToday && year == yearToday)
            {
                currentRevenue += o.Payment.Amount;
                currentOrders++;
                currentCo2Saved += co2Saved;
            }

            if (month == request.Month && year == request.Year)
            {
                previousRevenue += o.Payment.Amount;
                previousOrders++;
                previousCo2Saved += co2Saved;
            }
        }

        foreach (var u in users)
        {
            var month = u.CreatedAt.Month;
            var year = u.CreatedAt.Year;

            if (month == monthToday && year == yearToday)
                currentUsers++;

            if (month == request.Month && year == request.Year)
                previousUsers++;
        }

        decimal revenueGrowth = 0m;
        if (previousRevenue != 0)
        {
            revenueGrowth = ((currentRevenue - previousRevenue) / previousRevenue) * 100;
        }
        else
        {
            revenueGrowth = 100m;
        }
        bool isRevenueGrowth = currentRevenue > previousRevenue;
        var revenueRecord = new Revenue(currentRevenue, previousRevenue, revenueGrowth, isRevenueGrowth);

        decimal ordersGrowth = 0m;
        if (previousOrders != 0)
        {
            ordersGrowth = ((decimal)(currentOrders - previousOrders) / previousOrders) * 100;
        }
        else
        {
            ordersGrowth = 100m;
        }
        bool isOrdersGrowth = currentOrders > previousOrders;
        var ordersRecord = new Orders(currentOrders, previousOrders, ordersGrowth, isOrdersGrowth);

        decimal usersGrowth = 0m;
        if (previousUsers != 0)
        {
            usersGrowth = ((decimal)(currentUsers - previousUsers) / previousUsers) * 100;
        }
        else
        {
            usersGrowth = 100m;
        }
        bool isUsersGrowth = currentUsers > previousUsers;
        var usersRecord = new Users(currentUsers, previousUsers, usersGrowth, isUsersGrowth);

        float co2Growth = 0f;
        if (previousCo2Saved != 0)
        {
            co2Growth = ((currentCo2Saved - previousCo2Saved) / previousCo2Saved) * 100;
        }
        else
        {
            co2Growth = 100f;
        }
        bool isCo2Growth = currentCo2Saved > previousCo2Saved;
        var co2SavedRecord = new Co2Saved(currentCo2Saved, previousCo2Saved, co2Growth, isCo2Growth);

        var response = new GetInfoAnalystQueryResponse(
            TotalRevenue: revenueRecord,
            AmountOrders: ordersRecord,
            AmountUsers: usersRecord,
            TotalCo2Saved: co2SavedRecord
        );

        return response;
    }
}
