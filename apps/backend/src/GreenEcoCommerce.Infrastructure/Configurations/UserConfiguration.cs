using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GreenEcoCommerce.Infrastructure.Configurations;

internal class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("users");

        builder.HasKey(t => t.Id);

        builder.Property(t => t.Id)
                .HasColumnName("id")
                .IsRequired();

        builder.Property(t => t.Email)
                .HasColumnName("email")
                .HasConversion(
                    email => email.Value,
                    value => Email.Create(value)
                )
                .HasMaxLength(150)
                .IsRequired();

        builder.Property(t => t.PasswordHash)
                .HasColumnName("password_hash")
                .IsRequired();

        builder.Property(t => t.FirstName)
                .HasColumnName("first_name")
                .HasMaxLength(80)
                .IsRequired();

        builder.Property(t => t.LastName)
                .HasColumnName("last_name")
                .HasMaxLength(80)
                .IsRequired();

        builder.Property(t => t.FullName)
                .HasColumnName("full_name")
                .HasMaxLength(161)
                .IsRequired();

        builder.Property(t => t.Phone)
                .HasColumnName("phone")
                .HasConversion(
                    phone => phone.Value,
                    value => PhoneNumber.Create(value)
                )
                .HasMaxLength(10)
                .IsRequired();

        builder.Property(t => t.Address)
                .HasColumnName("address")
                .HasMaxLength(400)
                .IsRequired();

        builder.Property(t => t.Role)
                .HasColumnName("role")
                .HasConversion<string>()
                .HasMaxLength(15)
                .IsRequired();

        builder.Property(t => t.CreatedAt)
                .HasColumnName("created_at")
                .IsRequired();
    }
}
