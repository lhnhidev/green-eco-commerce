using GreenEcoCommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GreenEcoCommerce.Infrastructure.Configurations;

public class CategoryConfiguration : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> builder)
    {
        builder.ToTable("categories");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id).HasColumnName("id").IsRequired();
        builder.Property(e => e.ParentId).HasColumnName("parent_id").IsRequired(false);
        builder.Property(e => e.Name).HasColumnName("name").HasMaxLength(255).IsRequired();
        builder.Property(e => e.Description).HasColumnName("description").HasMaxLength(1000).IsRequired(false);

        builder.HasOne(e => e.ParentCategory)
               .WithMany(c => c.SubCategories)
               .HasForeignKey(e => e.ParentId)
               .OnDelete(DeleteBehavior.Restrict);
    }
}
