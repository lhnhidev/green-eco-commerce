using GreenEcoCommerce.Domain.Entities;

namespace GreenEcoCommerce.Domain.Interfaces;

public interface IPaymentRepository
{
    Task<Payment> AddPaymentAsync(Payment payment, CancellationToken ct = default);
}
