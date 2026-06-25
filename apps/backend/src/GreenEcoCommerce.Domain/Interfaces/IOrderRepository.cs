using GreenEcoCommerce.Domain.Entities;

namespace GreenEcoCommerce.Domain.Interfaces;

public interface IOrderRepository
{
    // Task<bool> OrderExistsAsync(Guid id, CancellationToken ct = default);
    Task<List<Order>> GetAllOrderByUserIdAsync(Guid userId, CancellationToken ct = default);
    Task<Order> AddOrderAsync(Order order, CancellationToken ct = default);
    // Task<bool> UpdateAsync(Order order, CancellationToken ct = default);
    // Task<List<Order>> GetSomeAsync(int pageSize, int pageNumber, CancellationToken ct = default);
    // Task DeleteOrderAsync(Guid id, CancellationToken ct = default);
}
