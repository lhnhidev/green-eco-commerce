using GreenEcoCommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GreenEcoCommerce.Infrastructure.Configurations;

public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.ToTable("orders");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id).HasColumnName("id");
        builder.Property(x => x.UserId).HasColumnName("user_id");
        builder.Property(x => x.VoucherId).HasColumnName("voucher_id");
        builder.Property(x => x.Status).HasColumnName("status").HasConversion<string>().HasMaxLength(50);
        builder.Property(x => x.DeliveryAddress).HasColumnName("delivery_address").HasMaxLength(500);
        builder.Property(x => x.Latitude).HasColumnName("latitude");
        builder.Property(x => x.Longitude).HasColumnName("longitude");
        builder.Property(x => x.SubTotal).HasColumnName("sub_total").HasPrecision(18, 2);
        builder.Property(x => x.DiscountAmount).HasColumnName("discount_amount").HasPrecision(18, 2);
        builder.Property(x => x.TotalAmount).HasColumnName("total_amount").HasPrecision(18, 2);
        builder.Property(x => x.TotalCo2Saved).HasColumnName("total_co2_saved");

        builder.Property(x => x.CreatedAt).HasColumnName("created_at");

        builder.HasOne(x => x.User)
                .WithMany(x => x.Orders)
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.Voucher)
                .WithOne(x => x.AppliedOrder)
                .HasForeignKey<Order>(x => x.VoucherId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.SetNull);
    }
}
