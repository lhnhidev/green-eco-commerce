using GreenEcoCommerce.Domain.Entities;

namespace GreenEcoCommerce.Domain.Interfaces;

public interface ICartRepository
{
    Task<Cart?> GetByUserIdAsync(Guid userId, CancellationToken ct = default);
    Task<Cart> GetOrCreateByUserIdAsync(Guid userId, CancellationToken ct = default);
    Task<CartItem?> GetCartItemAsync(Guid cartId, Guid productId, CancellationToken ct = default);
    Task<CartItem> AddItemAsync(CartItem item, CancellationToken ct = default);
    Task<bool> UpdateItemQuantityAsync(Guid cartId, Guid productId, int quantity, CancellationToken ct = default);
    Task<bool> RemoveItemAsync(Guid cartId, Guid productId, CancellationToken ct = default);
    Task ClearCartAsync(Guid cartId, CancellationToken ct = default);
}
