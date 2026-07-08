using GreenEcoCommerce.Domain.Enums;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Admin.Queries;

public record GetInfoAnalystQuery() : IRequest<GetInfoAnalystQueryResponse>;

public class GetInfoAnalystQueryHandler(IOrderRepository orderRepository, IUserRepository userRepository) : IRequestHandler<GetInfoAnalystQuery, GetInfoAnalystQueryResponse>
{
    public async Task<GetInfoAnalystQueryResponse> Handle(GetInfoAnalystQuery request, CancellationToken cancellationToken)
    {
        var users = await userRepository.GetAllUsersAsync();
        var orders = users.SelectMany(u => u.Orders).ToList();

        var analysted = new GetInfoAnalystQueryResponse
        (
            orders.Sum(o =>
            {
                if (o.Payment.Status.Equals(PaymentStatusEnum.Paid))
                {
                    return o.Payment.Amount;
                }

                return 0;
            }),
            orders.Count,
            users.Count,
            orders.Sum(o => o.OrderItems.Sum(oi => oi.UnitCo2Saved * oi.Quantity))
        );

        return analysted;
    }
}
