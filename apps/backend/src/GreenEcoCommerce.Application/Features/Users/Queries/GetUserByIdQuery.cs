using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Application.Queries;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Users.Queries;

public record GetUserByIdQuery(Guid Id): IRequest<UserDto?>
{
    public class Handler(IApplicationDbContext dbContext) : IRequestHandler<GetUserByIdQuery, UserDto?>
    {
        public async Task<UserDto?> Handle(GetUserByIdQuery request, CancellationToken ct)
        {
            var user = await dbContext.Users.IsNotDeleted().WithId(request.Id).ProjectToDto().FirstOrDefaultAsync(ct);
            return user;
        }
    }
}
