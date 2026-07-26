using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Application.Queries;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Banners.Queries;

public record GetActiveBannersQuery : IRequest<BannerDto[]>
{
    public class Handler(IApplicationDbContext db) : IRequestHandler<GetActiveBannersQuery, BannerDto[]>
    {
        public async Task<BannerDto[]> Handle(GetActiveBannersQuery _, CancellationToken ct) =>
                await db.Banners
                        .IsActive()
                        .OrderBy(b => b.SortOrder)
                        .ProjectToDto()
                        .ToArrayAsync(ct);
    }
}
