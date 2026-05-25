using GreenEcoCommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GreenEcoCommerce.Infrastructure.Configurations;

public class DocumentConfiguration : IEntityTypeConfiguration<Document>
{
    public void Configure(EntityTypeBuilder<Document> builder)
    {
        builder.ToTable("documents");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id).HasColumnName("id").IsRequired();
        builder.Property(e => e.UploadedBy).HasColumnName("uploaded_by").IsRequired();
        builder.Property(e => e.FileName).HasColumnName("file_name").HasMaxLength(255).IsRequired();

        builder.Property(e => e.FileType)
                .HasColumnName("file_type")
                .HasConversion<string>()
                .HasMaxLength(50)
                .IsRequired();

        builder.Property(e => e.AzureUrl).HasColumnName("azure_url").HasMaxLength(2048).IsRequired();

        builder.HasOne(e => e.UploadedByUser)
                .WithMany(u => u.Documents)
                .HasForeignKey(e => e.UploadedBy);
    }
}
