using GreenEcoCommerce.Domain.Enums;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Payments.Queries;

public record GetTotalRevenueQuery : IRequest<decimal>
{
    public class Handler(IPaymentRepository paymentRepository) : IRequestHandler<GetTotalRevenueQuery, decimal>
    {
        public async Task<decimal> Handle(GetTotalRevenueQuery request, CancellationToken ct)
        {
            var payments = await paymentRepository.GetAllAsync(ct);

            decimal totalRevenue = payments.Where(p => p.Status.Equals(PaymentStatusEnum.Paid)).Sum(p => p.Amount);

            return totalRevenue;
        }
    }
}
