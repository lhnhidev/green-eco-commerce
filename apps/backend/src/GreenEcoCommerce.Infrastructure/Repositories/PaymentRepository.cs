using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Infrastructure.Repositories;

public class PaymentRepository(IApplicationDbContext context) : IPaymentRepository
{
    public async Task<List<Payment>> GetAllAsync(CancellationToken ct = default)
    {
        var payments = await context.Payments.ToListAsync(ct);
        return payments;
    }

    public async Task<Payment> AddPaymentAsync(Payment payment, CancellationToken ct = default)
    {
        await context.Payments.AddAsync(payment);
        await context.SaveChangesAsync(ct);
        return payment;
    }
}
