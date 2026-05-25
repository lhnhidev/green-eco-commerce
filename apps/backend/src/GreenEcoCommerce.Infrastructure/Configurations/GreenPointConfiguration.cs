using GreenEcoCommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GreenEcoCommerce.Infrastructure.Configurations;

public class GreenPointConfiguration : IEntityTypeConfiguration<GreenPoint>
{
    public void Configure(EntityTypeBuilder<GreenPoint> builder)
    {
        builder.ToTable("green_points");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id).HasColumnName("id").IsRequired();
        builder.Property(e => e.UserId).HasColumnName("user_id").IsRequired();
        builder.Property(e => e.Balance).HasColumnName("balance").IsRequired();
        builder.Property(e => e.EarnedTotal).HasColumnName("earned_total").IsRequired();
        builder.Property(e => e.UpdatedAt).HasColumnName("updated_at").IsRequired();

        builder.HasOne(e => e.User)
                .WithOne(u => u.GreenPoint)
                .HasForeignKey<GreenPoint>(e => e.UserId);
    }
}
