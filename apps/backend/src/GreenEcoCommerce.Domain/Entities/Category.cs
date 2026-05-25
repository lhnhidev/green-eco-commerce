namespace GreenEcoCommerce.Domain.Entities;

public class Category
{
    public Guid Id { get; init; } = Guid.CreateVersion7();
    public Guid? ParentId { get; set; }
    public required string Name { get; set; }
    public required string Description { get; set; }

    // Navigation properties
    public Category? ParentCategory { get; init; }
    public ICollection<Category> SubCategories { get; init; } = new HashSet<Category>();
    public ICollection<Product> Products { get; init; } = new HashSet<Product>();
}
