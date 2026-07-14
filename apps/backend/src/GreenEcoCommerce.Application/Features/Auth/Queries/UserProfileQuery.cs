using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Enums;
using GreenEcoCommerce.Domain.Exceptions;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;
using Riok.Mapperly.Abstractions;

namespace GreenEcoCommerce.Application.Features.Auth.Queries;

public partial record UserProfileQuery(Guid UserId) : IRequest<UserProfileQuery.Response>
{
    public record Response(
        Guid Id,
        string Avatar,
        string Email,
        string FirstName,
        string LastName,
        string Phone,
        string Address,
        RoleEnum Role,
        DateTimeOffset CreatedAt
    );

    public class Handler(IUserRepository userRepository) : IRequestHandler<UserProfileQuery, Response>
    {
        public async Task<Response> Handle(UserProfileQuery request, CancellationToken ct)
        {
            var user = await userRepository.GetUserByIdAsync(request.UserId);

            return user != null ? Mapper.ToProfile(user) : throw new NotFoundException("User not found");
        }
    }

    [Mapper]
    public static partial class Mapper
    {
        [MapperIgnoreSource(nameof(User.PasswordHash))]
        [MapperIgnoreSource(nameof(User.Cart))]
        [MapperIgnoreSource(nameof(User.UpdatedAt))]
        [MapperIgnoreSource(nameof(User.GreenWallet))]
        [MapperIgnoreSource(nameof(User.Orders))]
        [MapperIgnoreSource(nameof(User.ChatSessions))]
        [MapperIgnoreSource(nameof(User.Documents))]
        public static partial Response ToProfile(User user);
    }
}
