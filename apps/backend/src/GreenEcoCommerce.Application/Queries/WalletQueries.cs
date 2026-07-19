using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Queries;

public static class WalletQueries
{
    extension(IQueryable<GreenWallet> query)
    {
        public IQueryable<GreenWallet> OfUser(Guid userId) { return query.Where(w => w.UserId == userId); }

        public IQueryable<GreenWallet> IncludeTransactions() { return query.Include(w => w.Transactions); }
    }

    extension(IApplicationDbContext dbContext)
    {
        public async Task<PointTransaction> DepositWalletAsync(GreenWallet wallet, int amount, string description,
                                                               Guid? orderId = null, CancellationToken ct = default)
        {
            wallet.Balance += amount;
            wallet.EarnedTotal += amount;

            var transaction = new PointTransaction
            {
                WalletId = wallet.Id,
                OrderId = orderId,
                Amount = amount,
                Type = PointTransactionTypeEnum.Earn,
                Description = description
            };

            await dbContext.PointTransactions.AddAsync(transaction, ct);
            await dbContext.SaveChangesAsync(ct);

            return transaction;
        }

        public async Task<PointTransaction?> WithdrawalWalletAsync(GreenWallet wallet, int amount, string description,
                                                                   Guid? orderId = null, CancellationToken ct = default)
        {
            if (wallet.Balance < amount) { return null; }

            wallet.Balance -= amount;

            var transaction = new PointTransaction
            {
                WalletId = wallet.Id,
                OrderId = orderId,
                Amount = -amount,
                Type = PointTransactionTypeEnum.Redeem,
                Description = description
            };

            await dbContext.PointTransactions.AddAsync(transaction, ct);
            await dbContext.SaveChangesAsync(ct);

            return transaction;
        }
    }
}
