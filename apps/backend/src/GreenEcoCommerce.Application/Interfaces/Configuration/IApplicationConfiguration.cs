namespace GreenEcoCommerce.Application.Interfaces.Configuration;

public interface IApplicationConfiguration
{
    Task<decimal> GetGreenPointsPerCarbonIndexRatioAsync(CancellationToken ct = default);
    Task SetGreenPointsPerCarbonIndexRatioAsync(decimal value, CancellationToken ct = default);
}
