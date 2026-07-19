using GreenEcoCommerce.Application.Interfaces.Configuration;
using GreenEcoCommerce.Domain.Interfaces;

namespace GreenEcoCommerce.Infrastructure.Configuration;

public class ApplicationConfiguration(IAppConfigurationRepository repository): IApplicationConfiguration
{
    public Task<decimal> GetGreenPointsPerCarbonIndexRatioAsync(CancellationToken ct = default)
    {
        return repository.GetValueAsync("GreenPointsPerCarbonIndexRatio", 10m, ct);
    }

    public Task SetGreenPointsPerCarbonIndexRatioAsync(decimal value, CancellationToken ct = default)
    {
        return repository.SetAsync("GreenPointsPerCarbonIndexRatio", value, ct);
    }
}
