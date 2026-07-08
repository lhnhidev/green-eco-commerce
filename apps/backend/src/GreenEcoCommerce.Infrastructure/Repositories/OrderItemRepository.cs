using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Infrastructure.Repositories;

public class OrderItemRepository(IApplicationDbContext context) : IOrderItemRepository
{
    public Task<List<OrderItem>> GetAllOrderItemByUserIdAsync(Guid userId, CancellationToken ct = default) => throw new NotImplementedException();

    public async Task<OrderItem> AddOrderItemAsync(OrderItem orderItem, CancellationToken ct = default)
    {
        await context.OrderItems.AddAsync(orderItem);
        await context.SaveChangesAsync();
        return orderItem;
    }

    public async Task<List<OrderItem>> GetAllOrdersAsync(CancellationToken ct = default)
    {
        return await context.OrderItems.ToListAsync(ct);
    }
}
