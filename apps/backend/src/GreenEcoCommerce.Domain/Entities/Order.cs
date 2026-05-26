using GreenEcoCommerce.Domain.Enums;
using GreenEcoCommerce.Domain.Interfaces;

namespace GreenEcoCommerce.Domain.Entities;

public class Order: IHasCreatedAt
{
    public Guid Id { get; set; } = Guid.CreateVersion7();
    public Guid UserId { get; set; }
    public Guid? VoucherId { get; set; }
    public OrderStatusEnum Status { get; set; }
    public required string DeliveryAddress { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public decimal SubTotal { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal TotalAmount { get; set; }
    public float TotalCo2Saved { get; set; }
    public DateTimeOffset CreatedAt { get; set; }

    // Navigation Properties
    public User? User { get; set; }
    public Voucher? Voucher { get; set; }
    public Payment? Payment { get; set; }
    public ICollection<OrderItem> OrderItems { get; set; } = new HashSet<OrderItem>();
    public ICollection<PointTransaction> PointTransactions { get; set; } = new HashSet<PointTransaction>();
}
