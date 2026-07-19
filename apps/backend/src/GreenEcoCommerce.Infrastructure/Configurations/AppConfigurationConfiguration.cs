using GreenEcoCommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GreenEcoCommerce.Infrastructure.Configurations;

public class AppConfigurationConfiguration : IEntityTypeConfiguration<AppConfiguration>
{
    public void Configure(EntityTypeBuilder<AppConfiguration> builder)
    {
        builder.ToTable("app_configurations");
        builder.HasKey(c => c.Id);

        builder.Property(c => c.Id).HasColumnName("id");

        // Make Key unique
        builder.HasIndex(c => c.Key).IsUnique();

        builder.Property(c => c.Key)
            .HasColumnName("key")
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(c => c.Value)
            .HasColumnName("value")
            .HasColumnType("jsonb")
            .IsRequired();

        builder.Property(c => c.UpdatedAt)
            .HasColumnName("updated_at");
    }
}
