using GreenEcoCommerce.Domain.Enums;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Payments.Query;

public record GetTotalRevenueQuery : IRequest<decimal>;

public class GetTotalRevenueQueryHandler(IPaymentRepository paymentRepository) : IRequestHandler<GetTotalRevenueQuery, decimal>
{
    public async Task<decimal> Handle(GetTotalRevenueQuery request, CancellationToken cancellationToken)
    {
        var payments = await paymentRepository.GetAllAsync();

        var totalRevenue = payments.Where(p => p.Status.Equals(PaymentStatusEnum.Paid)).Sum(p => p.Amount);

        return totalRevenue;
    }
}
