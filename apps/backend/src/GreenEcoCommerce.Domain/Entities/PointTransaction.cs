using GreenEcoCommerce.Domain.Enums;
using GreenEcoCommerce.Domain.Interfaces;

namespace GreenEcoCommerce.Domain.Entities;

public class PointTransaction: IHasCreatedAt
{
    public Guid Id { get; set; } = Guid.CreateVersion7();
    public Guid WalletId { get; set; }
    public Guid? OrderId { get; set; }
    public decimal Amount { get; set; }
    public PointTransactionTypeEnum Type { get; set; }
    public string Description { get; set; } = string.Empty!;
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    // Navigation Properties
    public GreenWallet Wallet { get; set; } = null!;
    public Order? Order { get; set; } = null!;
}
