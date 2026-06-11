using GreenEcoCommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GreenEcoCommerce.Infrastructure.Configurations;

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.ToTable("products");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id).HasColumnName("id");
        builder.Property(x => x.CategoryId).HasColumnName("category_id");

        builder.Property(x => x.Name).HasColumnName("name").HasMaxLength(255);
        builder.Property(x => x.Description).HasColumnName("description");
        builder.Property(x => x.Price).HasColumnName("price").HasPrecision(18, 2);
        builder.Property(x => x.StockQty).HasColumnName("stock_qty");
        builder.Property(x => x.CarbonIndex).HasColumnName("carbon_index");
        builder.Property(x => x.BaselineCarbonIndex).HasColumnName("baseline_carbon_index");
        builder.Property(x => x.DecomposePercent).HasColumnName("decompose_percent");
        builder.Property(x => x.RecyclePercent).HasColumnName("recycle_percent");
        builder.Property(x => x.ImageUrl).HasColumnName("image_url").HasMaxLength(10000);
        builder.Property(x => x.IsActive).HasColumnName("is_active");

        builder.HasOne(x => x.Category)
                .WithMany(x => x.Products)
                .HasForeignKey(x => x.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(x => x.Materials).WithMany(x => x.Products).UsingEntity(x => x.ToTable("product_materials"));
    }
}
