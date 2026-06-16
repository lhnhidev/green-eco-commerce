using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Infrastructure.Repositories;

public class CartRepository(IApplicationDbContext context) : ICartRepository
{
    public async Task<Cart?> GetByUserIdAsync(Guid userId, CancellationToken ct)
    {
        return await context.Carts
            .Include(c => c.CartItems)
                .ThenInclude(ci => ci.Product)
            .FirstOrDefaultAsync(c => c.UserId == userId, ct);
    }

    public async Task<Cart> GetOrCreateByUserIdAsync(Guid userId, CancellationToken ct)
    {
        var cart = await GetByUserIdAsync(userId, ct);

        if (cart != null) return cart;

        cart = new Cart { UserId = userId };
        await context.Carts.AddAsync(cart, ct);
        await context.SaveChangesAsync(ct);

        // Re-fetch with includes
        return (await GetByUserIdAsync(userId, ct))!;
    }

    public async Task<CartItem?> GetCartItemAsync(Guid cartId, Guid productId, CancellationToken ct)
    {
        return await context.CartItems
            .FirstOrDefaultAsync(ci => ci.CartId == cartId && ci.ProductId == productId, ct);
    }

    public async Task<CartItem> AddItemAsync(CartItem item, CancellationToken ct)
    {
        await context.CartItems.AddAsync(item, ct);
        await context.SaveChangesAsync(ct);
        return item;
    }

    public async Task<bool> UpdateItemQuantityAsync(Guid cartId, Guid productId, int quantity, CancellationToken ct)
    {
        int affectedRows = await context.CartItems
            .Where(ci => ci.CartId == cartId && ci.ProductId == productId)
            .ExecuteUpdateAsync(set => set
                .SetProperty(ci => ci.Quantity, quantity),
                ct);

        return affectedRows > 0;
    }

    public async Task<bool> RemoveItemAsync(Guid cartId, Guid productId, CancellationToken ct)
    {
        int affectedRows = await context.CartItems
            .Where(ci => ci.CartId == cartId && ci.ProductId == productId)
            .ExecuteDeleteAsync(ct);

        return affectedRows > 0;
    }

    public async Task ClearCartAsync(Guid cartId, CancellationToken ct)
    {
        await context.CartItems
            .Where(ci => ci.CartId == cartId)
            .ExecuteDeleteAsync(ct);
    }
}
