using GreenEcoCommerce.Application.Interfaces.Persistence;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Banners.Commands;

public record UpdateBannerCommand(Guid Id, BannerPayloadDto Payload) : IRequest<BannerDto?>
{
    public class Handler(IApplicationDbContext db) : IRequestHandler<UpdateBannerCommand, BannerDto?>
    {
        public async Task<BannerDto?> Handle(UpdateBannerCommand cmd, CancellationToken ct)
        {
            var banner = await db.Banners.FindAsync([cmd.Id], ct);
            if (banner is null) return null;

            banner.ApplyUpdate(cmd.Payload);
            await db.SaveChangesAsync(ct);

            return banner.ToDto();
        }
    }
}
