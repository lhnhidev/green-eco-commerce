using GreenEcoCommerce.Domain.Entities;

namespace GreenEcoCommerce.Application.Queries;

public static class PointTransactionQueries
{
    extension(IQueryable<PointTransaction> query)
    {
        public IQueryable<PointTransaction> OfWallet(Guid walletId)
        {
            return query.Where(pt => pt.WalletId == walletId);
        }

        public IQueryable<PointTransaction> OfUser(Guid userId)
        {
            return query.Where(pt => pt.Wallet.UserId == userId);
        }
    }
}
