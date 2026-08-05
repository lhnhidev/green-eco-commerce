using GreenEcoCommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GreenEcoCommerce.Infrastructure.Configurations;

public class ReviewConfiguration : IEntityTypeConfiguration<Review>
{
    public void Configure(EntityTypeBuilder<Review> builder)
    {
        builder.ToTable("reviews");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id).HasColumnName("id");
        builder.Property(x => x.UserId).HasColumnName("user_id");
        builder.Property(x => x.ProductId).HasColumnName("product_id");
        builder.Property(x => x.Rating).HasColumnName("rating");
        builder.Property(x => x.Comment).HasColumnName("comment").HasMaxLength(1000);
        builder.Property(x => x.IsApproved).HasColumnName("is_approved");
        builder.Property(x => x.IsHidden).HasColumnName("is_hidden");
        builder.Property(x => x.CreatedAt).HasColumnName("created_at");

        // One review per user per product. CreateReviewCommand upserts rather than rejecting a
        // second submission, so this index exists to settle concurrent inserts, not to block users.
        builder.HasIndex(x => new { x.UserId, x.ProductId }).IsUnique();

        builder.HasOne(x => x.User)
               .WithMany(x => x.Reviews)
               .HasForeignKey(x => x.UserId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Product)
               .WithMany(x => x.Reviews)
               .HasForeignKey(x => x.ProductId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}
