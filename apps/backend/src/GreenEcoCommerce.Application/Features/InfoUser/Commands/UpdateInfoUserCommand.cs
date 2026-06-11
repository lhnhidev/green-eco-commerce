using AutoMapper;
using GreenEcoCommerce.Application.Features.Auth.Login;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Exceptions;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.InfoUser.Commands;

public record UpdateInfoUserCommand(
    Guid Id,
    UpdateInfoUserDto Dto
) : IRequest<UpdateInfoUserResponse>;

public class UpdateInfoUserCommandHandler(IMapper mapper, IUserRepository userRepository) : IRequestHandler<UpdateInfoUserCommand, UpdateInfoUserResponse>
{
    public async Task<UpdateInfoUserResponse> Handle(UpdateInfoUserCommand request, CancellationToken cancellationToken)
    {
        var user = mapper.Map<User>(request);
        var found = await userRepository.UpdateUserAsync(user);
        return found
            ? mapper.Map<UpdateInfoUserResponse>(user)
            : throw new NotFoundException($"Info user with ID {request.Id} not found.");
    }
}
