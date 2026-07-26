using GreenEcoCommerce.Application.Interfaces.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Banners.Queries;

public record GetAllBannersQuery : IRequest<BannerDto[]>
{
    public class Handler(IApplicationDbContext db) : IRequestHandler<GetAllBannersQuery, BannerDto[]>
    {
        public async Task<BannerDto[]> Handle(GetAllBannersQuery query, CancellationToken ct) =>
            await db.Banners
                    .OrderBy(b => b.SortOrder)
                    .ProjectToDto()
                    .ToArrayAsync(ct);
    }
}
