using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Interfaces;

namespace GreenEcoCommerce.Infrastructure.Repositories;

public class GreenWalletRepository(IApplicationDbContext context) : IGreenWalletRepository
{
    public async Task<GreenWallet> AddGreenWalletAsync(GreenWallet greenWallet, CancellationToken ct = default)
    {
        await context.GreenWallets.AddAsync(greenWallet);
        return greenWallet;
    }
}
