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
    public required string Description { get; set; }
    public DateTimeOffset CreatedAt { get; set; }

    // Navigation Properties
    public GreenWallet Wallet { get; set; } = null!;
    public Order? Order { get; set; }
}
