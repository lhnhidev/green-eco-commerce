using GreenEcoCommerce.Domain.Entities;

namespace GreenEcoCommerce.Domain.Interfaces;

public interface IPointTransactionRepository
{
    Task<PointTransaction> AddPointTransactionAsync(PointTransaction pointTransaction, CancellationToken ct = default);
}
