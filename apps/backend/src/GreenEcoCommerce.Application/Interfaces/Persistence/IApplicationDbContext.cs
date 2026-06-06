using GreenEcoCommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Interfaces.Persistence;

public interface IApplicationDbContext
{
    public DbSet<User> Users { get; }

    // Catalog
    public DbSet<Category> Categories { get; }
    public DbSet<Product> Products { get; }
    public DbSet<ProductImage> ProductImages { get; }

    // Sales
    public DbSet<Cart> Carts { get; }
    public DbSet<CartItem> CartItems { get; }
    public DbSet<Order> Orders { get; }
    public DbSet<OrderItem> OrderItems { get; }
    public DbSet<Payment> Payments { get; }

    // Eco Rewards
    public DbSet<GreenWallet> GreenWallets { get; }
    public DbSet<PointTransaction> PointTransactions { get; }
    public DbSet<Voucher> Vouchers { get; }

    // AI Chat & RAG
    public DbSet<ChatSession> ChatSessions { get; }
    public DbSet<ChatMessage> ChatMessages { get; }
    public DbSet<Document> Documents { get; }
    public DbSet<Embedding> Embeddings { get; }

    public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
