using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Exceptions;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;
using Riok.Mapperly.Abstractions;

namespace GreenEcoCommerce.Application.Features.InfoUser.Commands;

public record UpdateInfoUserDto(
    string Avatar,
    string Email,
    string FirstName,
    string LastName,
    string Phone,
    string Address
);

public partial record UpdateInfoUserCommand(Guid Id, UpdateInfoUserDto Dto) : IRequest<UpdateInfoUserCommand.Response>
{
    public record Response(
        Guid Id,
        string Avatar,
        string Email,
        string FirstName,
        string LastName,
        string Phone,
        string Address
    );

    public class Handler(IUserRepository userRepository) : IRequestHandler<UpdateInfoUserCommand, Response>
    {
        public async Task<Response> Handle(UpdateInfoUserCommand request, CancellationToken ct)
        {
            var user = Mapper.ToEntity(request);
            bool found = await userRepository.UpdateUserAsync(user);
            return found
                    ? Mapper.ToDto(user)
                    : throw new NotFoundException($"Info user with ID {request.Id} not found.");
        }
    }

    [Mapper]
    public static partial class Mapper
    {
        [MapNestedProperties(nameof(Dto))]
        [MapValue(nameof(User.PasswordHash), "")]
        public static partial User ToEntity(UpdateInfoUserCommand command);

        public static partial Response ToDto(User user);
    }
}
