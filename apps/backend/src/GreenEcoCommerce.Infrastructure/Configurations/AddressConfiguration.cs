using GreenEcoCommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GreenEcoCommerce.Infrastructure.Configurations;

public class AddressConfiguration : IEntityTypeConfiguration<Address>
{
    public void Configure(EntityTypeBuilder<Address> builder)
    {
        builder.ToTable("addresses");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id).HasColumnName("id");
        builder.Property(x => x.UserId).HasColumnName("user_id");
        builder.Property(x => x.Label).HasColumnName("label").HasMaxLength(50);
        builder.Property(x => x.RecipientName).HasColumnName("recipient_name").HasMaxLength(100);
        builder.Property(x => x.Phone).HasColumnName("phone").HasMaxLength(20);
        builder.Property(x => x.FormattedAddress).HasColumnName("formatted_address").HasMaxLength(400);
        builder.Property(x => x.Commune).HasColumnName("commune").HasMaxLength(150);
        builder.Property(x => x.Province).HasColumnName("province").HasMaxLength(150);
        builder.Property(x => x.PlaceId).HasColumnName("place_id").HasMaxLength(200);
        builder.Property(x => x.IsDefault).HasColumnName("is_default");
        builder.Property(x => x.CreatedAt).HasColumnName("created_at");
        builder.Property(x => x.UpdatedAt).HasColumnName("updated_at");

        builder.HasIndex(x => new { x.UserId, x.IsDefault });

        builder.HasOne(x => x.User)
                .WithMany()
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);
    }
}
