using GreenEcoCommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GreenEcoCommerce.Infrastructure.Configurations;

public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.ToTable("orders");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id).HasColumnName("id").IsRequired();
        builder.Property(e => e.UserId).HasColumnName("user_id").IsRequired();

        builder.Property(e => e.Status)
                .HasColumnName("status")
                .HasConversion<string>()
                .HasMaxLength(50)
                .IsRequired();

        builder.Property(e => e.DeliveryAddress).HasColumnName("delivery_address").HasMaxLength(500).IsRequired();
        builder.Property(e => e.Latitude).HasColumnName("latitude").IsRequired();
        builder.Property(e => e.Longitude).HasColumnName("longitude").IsRequired();
        builder.Property(e => e.TotalAmount).HasColumnName("total_amount").IsRequired();
        builder.Property(e => e.TotalCo2Saved).HasColumnName("total_co2_saved").IsRequired();
        builder.Property(e => e.CreatedAt).HasColumnName("created_at").IsRequired();

        builder.HasOne(e => e.User)
                .WithMany(u => u.Orders)
                .HasForeignKey(e => e.UserId);
    }
}
