using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Users.Queries;

public record GetAmountAllUsersQuery : IRequest<int>;

public class GetAmountAllUsersQueryHandler(IUserRepository userRepository) : IRequestHandler<GetAmountAllUsersQuery, int>
{
    public async Task<int> Handle(GetAmountAllUsersQuery request, CancellationToken cancellationToken)
    {
        var users = await userRepository.GetAllUsersAsync();
        return users.Count;
    }
}
