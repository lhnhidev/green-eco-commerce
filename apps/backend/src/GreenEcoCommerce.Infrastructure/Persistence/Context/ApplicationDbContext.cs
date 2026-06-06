using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.ValueObjects;
using GreenEcoCommerce.Infrastructure.Converters;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Infrastructure.Persistence.Context;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : DbContext(options), IApplicationDbContext
{
    // Identity
    public DbSet<User> Users => Set<User>();

    // Catalog
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<ProductImage> ProductImages => Set<ProductImage>();

    // Sales
    public DbSet<Cart> Carts => Set<Cart>();
    public DbSet<CartItem> CartItems => Set<CartItem>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<Payment> Payments => Set<Payment>();

    // Eco Rewards
    public DbSet<GreenWallet> GreenWallets => Set<GreenWallet>();
    public DbSet<PointTransaction> PointTransactions => Set<PointTransaction>();
    public DbSet<Voucher> Vouchers => Set<Voucher>();

    // AI Chat & RAG
    public DbSet<ChatSession> ChatSessions => Set<ChatSession>();
    public DbSet<ChatMessage> ChatMessages => Set<ChatMessage>();
    public DbSet<Document> Documents => Set<Document>();
    public DbSet<Embedding> Embeddings => Set<Embedding>();

    protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
    {
        // This replaces the need for .HasConversion() on individual properties
        configurationBuilder
                .Properties<PhoneNumber>()
                .HaveConversion<PhoneNumberConverter>();

        configurationBuilder
                .Properties<Email>()
                .HaveConversion<EmailConverter>();
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Supabase mặc định dùng schema public
        modelBuilder.HasDefaultSchema("public");

        // Quét và áp dụng toàn bộ Configuration trong cùng một Assembly
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }
}
