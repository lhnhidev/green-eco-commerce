using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Application.Queries;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Profile.Queries;

public record GetUserProfileQuery(Guid Id) : IRequest<UserProfileDto?>
{
    public class Handler(IApplicationDbContext dbContext) : IRequestHandler<GetUserProfileQuery, UserProfileDto?>
    {
        public async Task<UserProfileDto?> Handle(GetUserProfileQuery request, CancellationToken cancellationToken)
        {
            var profile = await dbContext.Users.WithId(request.Id).ProjectToProfileDto()
                    .FirstOrDefaultAsync(cancellationToken);
            return profile;
        }
    }
}
