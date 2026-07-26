using GreenEcoCommerce.Domain.Interfaces;

namespace GreenEcoCommerce.Domain.Entities;

public class Review : IHasCreatedAt
{
    public Guid Id { get; set; } = Guid.CreateVersion7();
    public Guid UserId { get; set; }
    public Guid ProductId { get; set; }
    public int Rating { get; set; } // 1-5
    public string Comment { get; set; } = string.Empty;
    public bool IsApproved { get; set; } = false;
    public bool IsHidden { get; set; } = false;
    public DateTimeOffset CreatedAt { get; set; }

    // Navigation Properties
    public User User { get; set; } = null!;
    public Product Product { get; set; } = null!;
}
