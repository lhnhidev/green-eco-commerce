using GreenEcoCommerce.Domain.Entities;

namespace GreenEcoCommerce.Domain.Interfaces;

public interface IOrderItemRepository
{
    Task<List<OrderItem>> GetAllOrderItemByUserIdAsync(Guid userId, CancellationToken ct = default);
    Task<OrderItem> AddOrderItemAsync(OrderItem orderItem, CancellationToken ct = default);
    Task<List<OrderItem>> GetAllOrdersAsync(CancellationToken ct = default);
}
