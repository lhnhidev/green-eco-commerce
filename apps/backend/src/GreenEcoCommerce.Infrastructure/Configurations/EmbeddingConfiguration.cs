using GreenEcoCommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pgvector;

namespace GreenEcoCommerce.Infrastructure.Configurations;

public class EmbeddingConfiguration : IEntityTypeConfiguration<Embedding>
{
    public void Configure(EntityTypeBuilder<Embedding> builder)
    {
        var floatArrayComparer = new ValueComparer<float[]>(
            // Compare elements
            (c1, c2) => c1 != null && c2 != null && ((IEnumerable<float>)c1).SequenceEqual(c2),

            // Generate a hash code based on the elements
            c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),

            // Create a deep copy (snapshot) for change tracking
            c => c.ToArray()
        );

        builder.ToTable("embeddings");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id).HasColumnName("id");
        builder.Property(x => x.DocumentId).HasColumnName("document_id");
        builder.Property(x => x.ChunkText).HasColumnName("chunk_text");
        builder.Property(x => x.VectorData).HasColumnName("vector_data").HasColumnType("vector(1536)")
                .HasConversion(
                    v => new Vector(v), // From Domain float[] to Infrastructure Vector
                    v => v.ToArray()       // From Infrastructure Vector to Domain float[]
                )
                .Metadata.SetValueComparer(floatArrayComparer);

        builder.HasOne(x => x.Document)
                .WithMany(x => x.Embeddings)
                .HasForeignKey(x => x.DocumentId)
                .OnDelete(DeleteBehavior.Cascade);
    }
}
