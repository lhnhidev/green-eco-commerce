using GreenEcoCommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GreenEcoCommerce.Infrastructure.Configurations;

public class PointTransactionConfiguration : IEntityTypeConfiguration<PointTransaction>
{
    public void Configure(EntityTypeBuilder<PointTransaction> builder)
    {
        builder.ToTable("point_transactions");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id).HasColumnName("id");
        builder.Property(x => x.WalletId).HasColumnName("wallet_id");
        builder.Property(x => x.OrderId).HasColumnName("order_id");
        builder.Property(x => x.Type).HasColumnName("type").HasConversion<string>().HasMaxLength(50);
        builder.Property(x => x.Amount).HasColumnName("amount");
        builder.Property(x => x.Description).HasColumnName("description").HasMaxLength(500);

        builder.Property(x => x.CreatedAt).HasColumnName("created_at");

        builder.HasOne(x => x.Wallet)
                .WithMany(x => x.Transactions)
                .HasForeignKey(x => x.WalletId)
                .OnDelete(DeleteBehavior.Cascade);

        // One-to-many: an order can accrue more than one point transaction over its lifecycle
        // (e.g. earn/redeem at checkout, then a reversal/clawback if the order is cancelled).
        builder.HasOne(x => x.Order)
                .WithMany(x => x.PointTransactions)
                .HasForeignKey(x => x.OrderId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.SetNull);
    }
}
