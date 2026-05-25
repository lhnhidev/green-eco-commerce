using GreenEcoCommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GreenEcoCommerce.Infrastructure.Configurations;

public class VoucherConfiguration : IEntityTypeConfiguration<Voucher>
{
    public void Configure(EntityTypeBuilder<Voucher> builder)
    {
        builder.ToTable("vouchers");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id).HasColumnName("id").IsRequired();
        builder.Property(e => e.GreenPointId).HasColumnName("green_point_id").IsRequired();
        builder.Property(e => e.Code).HasColumnName("code").HasMaxLength(50).IsRequired();
        builder.Property(e => e.DiscountValue).HasColumnName("discount_value").HasColumnType("decimal(18,2)").IsRequired();
        builder.Property(e => e.PointsCost).HasColumnName("points_cost").IsRequired();
        builder.Property(e => e.ExpiresAt).HasColumnName("expires_at").IsRequired();
        builder.Property(e => e.IsUsed).HasColumnName("is_used").IsRequired();

        builder.HasOne(e => e.GreenPoint)
                .WithMany(gp => gp.Vouchers)
                .HasForeignKey(e => e.GreenPointId);
    }
}
