using AutoMapper;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Exceptions;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Auth.Register;

public record RegisterCommand(
    string FirstName,
    string LastName,
    string Phone,
    string AddressDefault,
    string? Role,
    string Email,
    string Password
) : IRequest<Guid>;

public class RegisterHandler(IUserRepository userRepository, IMapper mapper) : IRequestHandler<RegisterCommand, Guid>
{
    public async Task<Guid> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        bool emailExist = await userRepository.EmailUserExist(request.Email);

        if (emailExist)
        {
            throw new BadRequestException("Email user is exist");
        }

        var userEntity = mapper.Map<User>(request);

        var guid = await userRepository.AddUserAsync(userEntity);

        return guid;
    }
}
