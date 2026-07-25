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
    DbSet<Review> Reviews { get; }

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

    // Automatic transaction
    Task<int> SaveChangesAsync(CancellationToken ct = default);

    // Manual transaction
    Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken ct = default);
}
