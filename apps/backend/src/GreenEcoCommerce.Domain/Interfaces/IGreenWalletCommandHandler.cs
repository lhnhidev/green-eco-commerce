using GreenEcoCommerce.Domain.Entities;

namespace GreenEcoCommerce.Domain.Interfaces;

public interface IGreenWalletRepository
{
    Task<GreenWallet> AddGreenWalletAsync(GreenWallet greenWallet, CancellationToken ct = default);
}
