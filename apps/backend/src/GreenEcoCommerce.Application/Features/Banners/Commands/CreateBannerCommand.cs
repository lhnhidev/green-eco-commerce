using GreenEcoCommerce.Application.Interfaces.Persistence;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Banners.Commands;

public class CreateBannerCommandHandler(IApplicationDbContext dbContext) : IRequestHandler<BannerPayloadDto, BannerDto>
{
    public async Task<BannerDto> Handle(BannerPayloadDto cmd, CancellationToken ct)
    {
        var banner = cmd.ToEntity();

        dbContext.Banners.Add(banner);
        await dbContext.SaveChangesAsync(ct);

        return banner.ToDto();
    }
}
