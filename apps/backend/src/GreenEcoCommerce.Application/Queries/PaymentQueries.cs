using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Enums;

namespace GreenEcoCommerce.Application.Queries;

public static class PaymentQueries
{
    extension(IQueryable<Payment> query)
    {
        public IQueryable<Payment> IsPaid()
        {
            return query.Where(p => p.Status == PaymentStatusEnum.Paid);
        }
    }
}
