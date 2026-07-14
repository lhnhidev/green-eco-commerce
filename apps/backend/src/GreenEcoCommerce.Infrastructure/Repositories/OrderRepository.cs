using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Infrastructure.Repositories;

public class OrderRepository(IApplicationDbContext context) : IOrderRepository
{
    public async Task<List<Order>> GetAllOrderByUserIdAsync(Guid userId, CancellationToken ct = default)
    {
        var orders = await context.Orders
            .Where(o => o.UserId == userId)
            .Include(o => o.PointTransaction)
            .Include(o => o.Payment)
            .Include(o => o.OrderItems)
            .ToListAsync(ct);

        return orders;
    }

    public Task<List<Order>> GetAllOrders(CancellationToken ct = default)
    {
        return context.Orders
            .Include(o => o.PointTransaction)
            .Include(o => o.Payment)
            .Include(o => o.OrderItems)
            .ToListAsync(ct);
    }

    public async Task<Order> AddOrderAsync(Order order, CancellationToken ct = default)
    {
        await context.Orders.AddAsync(order);
        await context.SaveChangesAsync(ct);
        return order;
    }
}
