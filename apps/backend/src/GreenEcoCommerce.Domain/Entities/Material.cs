using GreenEcoCommerce.Domain.Enums;

namespace GreenEcoCommerce.Domain.Entities;

public class Material
{
    public Guid Id { get; set; } = Guid.CreateVersion7();
    public required string Name { get; set; }
    public required MaterialTypeEnum Type { get; set; }
    public int EcoRating { get; set; }

    // Navigation Properties
    public ICollection<Product> Products { get; set; } = new HashSet<Product>();
}
