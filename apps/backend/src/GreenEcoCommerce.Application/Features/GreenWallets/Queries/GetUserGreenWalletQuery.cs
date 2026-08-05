using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Application.Queries;
using GreenEcoCommerce.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.GreenWallets.Queries;

public record GetUserGreenWalletQuery(Guid UserId) : IRequest<GreenWalletDto>
{
    public class Handler(IApplicationDbContext dbContext) : IRequestHandler<GetUserGreenWalletQuery, GreenWalletDto>
    {
        public async Task<GreenWalletDto> Handle(GetUserGreenWalletQuery request, CancellationToken ct)
        {
            var greenWallet = await dbContext.GreenWallets.OfUser(request.UserId).IncludeTransactions().ProjectToDto()
                    .FirstOrDefaultAsync(ct);
            return greenWallet ??
                   throw new NotFoundException($"Green wallet for user with ID {request.UserId} not found.");
        }
    }
}
