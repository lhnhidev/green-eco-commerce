using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Infrastructure.Converters;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace GreenEcoCommerce.Infrastructure.Persistence.Context;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : DbContext(options), IApplicationDbContext
{
    // Identity
    public DbSet<User> Users => Set<User>();

    // Catalog
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Material> Materials => Set<Material>();

    // Sales
    public DbSet<Cart> Carts => Set<Cart>();
    public DbSet<CartItem> CartItems => Set<CartItem>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<Payment> Payments => Set<Payment>();

    // Eco Rewards
    public DbSet<GreenWallet> GreenWallets => Set<GreenWallet>();
    public DbSet<PointTransaction> PointTransactions => Set<PointTransaction>();

    // AI Chat & RAG
    public DbSet<ChatSession> ChatSessions => Set<ChatSession>();
    public DbSet<ChatMessage> ChatMessages => Set<ChatMessage>();
    public DbSet<Document> Documents => Set<Document>();
    public DbSet<Embedding> Embeddings => Set<Embedding>();

    // Settings & Config
    public DbSet<AppConfiguration> AppConfigurations => Set<AppConfiguration>();

    // Reviews, Coupons & Banners
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<Coupon> Coupons => Set<Coupon>();
    public DbSet<Banner> Banners => Set<Banner>();

    // Wishlist
    public DbSet<WishlistItem> WishlistItems => Set<WishlistItem>();

    // Notifications
    public DbSet<Notification> Notifications => Set<Notification>();

    // Address book
    public DbSet<Address> Addresses => Set<Address>();

    public Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken ct = default) =>
            Database.BeginTransactionAsync(ct);

    public IExecutionStrategy CreateExecutionStrategy() => Database.CreateExecutionStrategy();

    protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
    {
        base.ConfigureConventions(configurationBuilder);

        configurationBuilder.RegisterAllInVogenEfCoreConverters();
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.HasPostgresExtension("vector");

        // Supabase mặc định dùng schema public
        modelBuilder.HasDefaultSchema("public");

        // Quét và áp dụng toàn bộ Configuration trong cùng một Assembly
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }
}
