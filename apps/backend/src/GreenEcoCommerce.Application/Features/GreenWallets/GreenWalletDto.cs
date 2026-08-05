using GreenEcoCommerce.Domain.Entities;
using Riok.Mapperly.Abstractions;

namespace GreenEcoCommerce.Application.Features.GreenWallets;

public record GreenWalletDto(int Balance, int EarnedTotal, PointTransactionDto[] Transactions);

public record PointTransactionDto(Guid Id, int Amount, string Description, Guid? OrderId, DateTimeOffset CreatedAt);

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
public static partial class GreenWalletDtoMapper
{
    public static partial GreenWalletDto ToDto(this GreenWallet wallet);
    public static partial PointTransactionDto ToDto(this PointTransaction transaction);
    public static partial IQueryable<GreenWalletDto> ProjectToDto(this IQueryable<GreenWallet> q);
}

