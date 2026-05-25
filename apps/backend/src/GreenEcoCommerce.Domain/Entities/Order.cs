using GreenEcoCommerce.Domain.Enums;

namespace GreenEcoCommerce.Domain.Entities;

public class Order
{
    public Guid Id { get; init; } = Guid.CreateVersion7();
    public required Guid UserId { get; set; }
    public required OrderStatusEnum Status { get; set; }
    public required string DeliveryAddress { get; set; }
    public required float Latitude { get; set; }
    public required float Longitude { get; set; }
    public required decimal TotalAmount { get; set; }
    public required float TotalCo2Saved { get; set; }
    public required DateTime CreatedAt { get; set; }

    // Navigation properties
    public User User { get; init; } = null!;
    public Payment Payment { get; init; } = null!;
    public ICollection<OrderItem> OrderItems { get; init; } = new HashSet<OrderItem>();
}
