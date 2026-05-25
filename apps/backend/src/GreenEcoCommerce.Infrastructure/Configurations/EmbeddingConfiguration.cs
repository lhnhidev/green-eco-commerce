using GreenEcoCommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GreenEcoCommerce.Infrastructure.Configurations;

public class EmbeddingConfiguration : IEntityTypeConfiguration<Embedding>
{
    public void Configure(EntityTypeBuilder<Embedding> builder)
    {
        builder.ToTable("embeddings");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id).HasColumnName("id").IsRequired();
        builder.Property(e => e.DocumentId).HasColumnName("document_id").IsRequired();
        builder.Property(e => e.ChunkText).HasColumnName("chunk_text").IsRequired();
        builder.Property(e => e.VectorId).HasColumnName("vector_id").HasMaxLength(100).IsRequired();

        builder.HasOne(e => e.Document)
                .WithMany(d => d.Embeddings)
                .HasForeignKey(e => e.DocumentId);
    }
}
