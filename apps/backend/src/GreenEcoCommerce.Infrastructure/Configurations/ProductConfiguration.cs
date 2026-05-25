using GreenEcoCommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GreenEcoCommerce.Infrastructure.Configurations;

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.ToTable("products");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id).HasColumnName("id").IsRequired();
        builder.Property(e => e.CategoryId).HasColumnName("category_id").IsRequired();
        builder.Property(e => e.Name).HasColumnName("name").HasMaxLength(255).IsRequired();
        builder.Property(e => e.Description).HasColumnName("description").HasMaxLength(2000).IsRequired(false);
        builder.Property(e => e.Price).HasColumnName("price").HasColumnType("decimal(18,2)").IsRequired();
        builder.Property(e => e.StockQty).HasColumnName("stock_qty").IsRequired();
        builder.Property(e => e.CarbonIndex).HasColumnName("carbon_index").IsRequired();
        builder.Property(e => e.MaterialOrigin).HasColumnName("material_origin").HasMaxLength(100).IsRequired(false);
        builder.Property(e => e.DecomposePercent).HasColumnName("decompose_percent").IsRequired();
        builder.Property(e => e.RecyclePercent).HasColumnName("recycle_percent").IsRequired();

        builder.HasOne(e => e.Category)
                .WithMany(c => c.Products)
                .HasForeignKey(e => e.CategoryId);
    }
}
