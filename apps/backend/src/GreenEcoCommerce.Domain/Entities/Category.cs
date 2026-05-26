namespace GreenEcoCommerce.Domain.Entities;

public class Category
{
    public Guid Id { get; set; } = Guid.CreateVersion7();
    public Guid? ParentId { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }

    // Navigation Properties
    public Category? ParentCategory { get; set; }
    public ICollection<Category> ChildCategories { get; set; } = new HashSet<Category>();
    public ICollection<Product> Products { get; set; } = new HashSet<Product>();
}
