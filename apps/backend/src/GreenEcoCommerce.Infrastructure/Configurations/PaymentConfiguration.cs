using GreenEcoCommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GreenEcoCommerce.Infrastructure.Configurations;

public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
{
    public void Configure(EntityTypeBuilder<Payment> builder)
    {
        builder.ToTable("payments");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id).HasColumnName("id").IsRequired();
        builder.Property(e => e.OrderId).HasColumnName("order_id").IsRequired();

        builder.Property(e => e.Method)
                .HasColumnName("method")
                .HasConversion<string>()
                .HasMaxLength(50)
                .IsRequired();

        builder.Property(e => e.Status)
                .HasColumnName("status")
                .HasConversion<string>()
                .HasMaxLength(50)
                .IsRequired();

        builder.Property(e => e.Amount).HasColumnName("amount").HasColumnType("decimal(18,2)").IsRequired();
        builder.Property(e => e.TransactionRef).HasColumnName("transaction_ref").HasMaxLength(100).IsRequired(false);

        builder.HasOne(e => e.Order)
                .WithOne(o => o.Payment)
                .HasForeignKey<Payment>(e => e.OrderId);
    }
}
