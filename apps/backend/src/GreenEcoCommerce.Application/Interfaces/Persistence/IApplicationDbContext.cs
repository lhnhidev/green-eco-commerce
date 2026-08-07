using GreenEcoCommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace GreenEcoCommerce.Application.Interfaces.Persistence;

public interface IApplicationDbContext
{
    DbSet<User> Users { get; }

    // Catalog
    DbSet<Category> Categories { get; }
    DbSet<Product> Products { get; }
    DbSet<Material> Materials { get; }

    // Sales
    DbSet<Cart> Carts { get; }
    DbSet<CartItem> CartItems { get; }
    DbSet<Order> Orders { get; }
    DbSet<OrderItem> OrderItems { get; }
    DbSet<Payment> Payments { get; }

    // Eco Rewards
    DbSet<GreenWallet> GreenWallets { get; }
    DbSet<PointTransaction> PointTransactions { get; }

    // AI Chat & RAG
    DbSet<ChatSession> ChatSessions { get; }
    DbSet<ChatMessage> ChatMessages { get; }
    DbSet<Document> Documents { get; }
    DbSet<Embedding> Embeddings { get; }

    // Settings & Config
    DbSet<AppConfiguration> AppConfigurations { get; }

    // Reviews, Coupons & Banners
    DbSet<Review> Reviews { get; }
    DbSet<Coupon> Coupons { get; }
    DbSet<Banner> Banners { get; }

    // Wishlist
    DbSet<WishlistItem> WishlistItems { get; }

    // Notifications
    DbSet<Notification> Notifications { get; }

    // Address book
    DbSet<Address> Addresses { get; }

    // Automatic transaction
    Task<int> SaveChangesAsync(CancellationToken ct = default);

    // Manual transaction
    Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken ct = default);

    // Required to retry a manual transaction as a unit when the provider has retry-on-failure enabled
    IExecutionStrategy CreateExecutionStrategy();
}
