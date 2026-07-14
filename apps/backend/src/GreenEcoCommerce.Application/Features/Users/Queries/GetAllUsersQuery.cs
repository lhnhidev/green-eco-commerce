using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Users.Queries;

public record GetAllUsersQuery : IRequest<UserDto[]>
{
    public class GetAmountAllUsersQueryHandler(IUserRepository userRepository) : IRequestHandler<GetAllUsersQuery, UserDto[]>
    {
        public async Task<UserDto[]> Handle(GetAllUsersQuery request, CancellationToken ct)
        {
            var users = await userRepository.GetAllUsersAsync();
            return users.Select(UserDtoMapper.ToDto).ToArray();
        }
    }
}
