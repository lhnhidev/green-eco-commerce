using GreenEcoCommerce.Domain.Enums;
using GreenEcoCommerce.Domain.Interfaces;

namespace GreenEcoCommerce.Domain.Entities;

public class Payment: IHasCreatedAt
{
    public Guid Id { get; set; } = Guid.CreateVersion7();
    public Guid OrderId { get; set; }
    public PaymentMethodEnum Method { get; set; }
    public PaymentStatusEnum Status { get; set; }
    public decimal Amount { get; set; }
    public required string TransactionRef { get; set; }
    public DateTimeOffset CreatedAt { get; set; }

    // Navigation Properties
    public Order? Order { get; set; }
}
