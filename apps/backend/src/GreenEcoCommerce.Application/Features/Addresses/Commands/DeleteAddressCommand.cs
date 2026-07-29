using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Addresses.Commands;

public record DeleteAddressCommand(Guid AddressId, Guid UserId) : IRequest
{
    public class Handler(IApplicationDbContext dbContext) : IRequestHandler<DeleteAddressCommand>
    {
        public async Task Handle(DeleteAddressCommand command, CancellationToken ct)
        {
            var address = await dbContext.Addresses
                .FirstOrDefaultAsync(a => a.Id == command.AddressId && a.UserId == command.UserId, ct)
                ?? throw new NotFoundException("Address not found.");

            var wasDefault = address.IsDefault;
            dbContext.Addresses.Remove(address);
            await dbContext.SaveChangesAsync(ct);

            // Promote the most recently added remaining address to default so the user
            // is never left without one while they still have addresses saved.
            if (wasDefault)
            {
                var nextDefault = await dbContext.Addresses
                    .Where(a => a.UserId == command.UserId)
                    .OrderByDescending(a => a.CreatedAt)
                    .FirstOrDefaultAsync(ct);

                if (nextDefault != null)
                {
                    nextDefault.IsDefault = true;
                    await dbContext.SaveChangesAsync(ct);
                }
            }
        }
    }
}
