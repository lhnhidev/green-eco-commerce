using GreenEcoCommerce.Application.Interfaces.Configuration;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Admin.Queries;

public record GetApplicationSettingsQuery : IRequest<GetApplicationSettingsQuery.Response>
{
    public record Response(decimal GreenPointsPerCarbonIndexRatio);

    public class Handler(IApplicationConfiguration configuration) : IRequestHandler<GetApplicationSettingsQuery, Response>
    {
        public async Task<Response> Handle(GetApplicationSettingsQuery request, CancellationToken ct)
        {
            var ratio = await configuration.GetGreenPointsPerCarbonIndexRatioAsync(ct);
            return new Response(ratio);
        }
    }
}
