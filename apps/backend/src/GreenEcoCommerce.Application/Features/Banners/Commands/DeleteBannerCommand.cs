using GreenEcoCommerce.Application.Interfaces.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Banners.Commands;

public record DeleteBannerCommand(Guid Id) : IRequest
{
    public class Handler(IApplicationDbContext db) : IRequestHandler<DeleteBannerCommand>
    {
        public async Task Handle(DeleteBannerCommand cmd, CancellationToken ct)
        {
            await db.Banners.Where(b => b.Id == cmd.Id).ExecuteDeleteAsync(ct);
        }
    }
}
