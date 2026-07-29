using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Addresses.Commands;

public record SetDefaultAddressCommand(Guid AddressId, Guid UserId) : IRequest
{
    public class Handler(IApplicationDbContext dbContext) : IRequestHandler<SetDefaultAddressCommand>
    {
        public async Task Handle(SetDefaultAddressCommand command, CancellationToken ct)
        {
            var exists = await dbContext.Addresses
                .AnyAsync(a => a.Id == command.AddressId && a.UserId == command.UserId, ct);
            if (!exists) { throw new NotFoundException("Address not found."); }

            await using var transaction = await dbContext.BeginTransactionAsync(ct);

            await dbContext.Addresses
                .Where(a => a.UserId == command.UserId && a.IsDefault)
                .ExecuteUpdateAsync(set => set.SetProperty(a => a.IsDefault, false), ct);

            await dbContext.Addresses
                .Where(a => a.Id == command.AddressId)
                .ExecuteUpdateAsync(set => set.SetProperty(a => a.IsDefault, true), ct);

            await transaction.CommitAsync(ct);
        }
    }
}
