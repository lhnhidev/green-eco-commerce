using GreenEcoCommerce.Application.Interfaces.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Addresses.Queries;

public record GetMyAddressesQuery(Guid UserId) : IRequest<AddressDto[]>
{
    public class Handler(IApplicationDbContext dbContext) : IRequestHandler<GetMyAddressesQuery, AddressDto[]>
    {
        public async Task<AddressDto[]> Handle(GetMyAddressesQuery request, CancellationToken ct)
        {
            return await dbContext.Addresses
                .Where(a => a.UserId == request.UserId)
                .OrderByDescending(a => a.IsDefault)
                .ThenByDescending(a => a.CreatedAt)
                .ProjectToDto()
                .ToArrayAsync(ct);
        }
    }
}
