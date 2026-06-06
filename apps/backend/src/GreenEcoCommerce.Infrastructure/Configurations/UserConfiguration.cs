using GreenEcoCommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GreenEcoCommerce.Infrastructure.Configurations;

internal class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("users");
        builder.HasKey(t => t.Id);

        builder.Property(t => t.Id).HasColumnName("id").IsRequired();
        builder.Property(t => t.Email).HasColumnName("email").HasMaxLength(150).IsRequired();
        builder.HasIndex(x => x.Email).IsUnique();

        builder.Property(t => t.PasswordHash).HasColumnName("password_hash").HasMaxLength(500).IsRequired();
        builder.Property(t => t.FirstName).HasColumnName("first_name").HasMaxLength(80).IsRequired();
        builder.Property(t => t.LastName).HasColumnName("last_name").HasMaxLength(80).IsRequired();
        builder.Property(t => t.FullName).HasColumnName("full_name").HasMaxLength(161).IsRequired();
        builder.Property(t => t.Phone).HasColumnName("phone").HasMaxLength(10).IsRequired();
        builder.Property(t => t.Address).HasColumnName("address").HasMaxLength(400).IsRequired();

        builder.Property(t => t.Role).HasColumnName("role").HasConversion<string>().HasMaxLength(15).IsRequired();

        builder.Property(x => x.CreatedAt).HasColumnName("created_at").IsRequired();
        builder.Property(x => x.UpdatedAt).HasColumnName("updated_at");

        builder.HasOne(x => x.Cart)
                .WithOne(x => x.User)
                .HasForeignKey<Cart>(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.GreenWallet)
                .WithOne(x => x.User)
                .HasForeignKey<GreenWallet>(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);
    }
}
