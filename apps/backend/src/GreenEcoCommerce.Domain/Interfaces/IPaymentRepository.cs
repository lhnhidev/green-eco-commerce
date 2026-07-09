using GreenEcoCommerce.Domain.Entities;

namespace GreenEcoCommerce.Domain.Interfaces;

public interface IPaymentRepository
{
    Task<List<Payment>> GetAllAsync(CancellationToken ct = default);
    Task<Payment> AddPaymentAsync(Payment payment, CancellationToken ct = default);
}
