using GreenEcoCommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GreenEcoCommerce.Infrastructure.Configurations;

public class VoucherConfiguration : IEntityTypeConfiguration<Voucher>
{
    public void Configure(EntityTypeBuilder<Voucher> builder)
    {
        builder.ToTable("vouchers");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id).HasColumnName("id");
        builder.Property(x => x.UserId).HasColumnName("user_id");
        builder.Property(x => x.Code).HasColumnName("code").HasMaxLength(50);
        builder.HasIndex(x => x.Code).IsUnique();

        builder.Property(x => x.DiscountValue).HasColumnName("discount_value").HasPrecision(18, 2);
        builder.Property(x => x.PointsCost).HasColumnName("points_cost").HasPrecision(15, 2);
        builder.Property(x => x.ExpiresAt).HasColumnName("expires_at");
        builder.Property(x => x.IsUsed).HasColumnName("is_used");

        builder.HasOne(x => x.User)
                .WithMany(x => x.Vouchers)
                .HasForeignKey(x => x.UserId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Cascade);
    }
}
