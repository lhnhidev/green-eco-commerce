using GreenEcoCommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GreenEcoCommerce.Infrastructure.Configurations;

public class DocumentConfiguration : IEntityTypeConfiguration<Document>
{
    public void Configure(EntityTypeBuilder<Document> builder)
    {
        builder.ToTable("documents");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id).HasColumnName("id");
        builder.Property(x => x.UploadedBy).HasColumnName("uploaded_by");
        builder.Property(x => x.FileName).HasColumnName("file_name").HasMaxLength(255);
        builder.Property(x => x.FileType).HasColumnName("file_type").HasConversion<string>().HasMaxLength(20);
        builder.Property(x => x.FileUrl).HasColumnName("file_url").HasMaxLength(1000);

        builder.Property(x => x.CreatedAt).HasColumnName("created_at");

        builder.HasOne(x => x.Uploader)
                .WithMany(x => x.Documents)
                .HasForeignKey(x => x.UploadedBy)
                .OnDelete(DeleteBehavior.Cascade);
    }
}
