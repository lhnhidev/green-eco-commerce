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
    string Address,
    string? Role,
    string Email,
    string Password
) : IRequest<RegisterResponse>;

public class RegisterHandler(IUserRepository userRepository, IMapper mapper) : IRequestHandler<RegisterCommand, RegisterResponse>
{
    public async Task<RegisterResponse> Handle(RegisterCommand request, CancellationToken ct)
    {
        bool emailExist = await userRepository.EmailUserExist(request.Email);
        bool phoneExist = await userRepository.PhoneNumberUserExist(request.Phone);

        if (emailExist) { throw new BadRequestException("Email was exist"); }

        if (phoneExist) { throw new BadRequestException("Phone was exist"); }

        var userEntity = mapper.Map<User>(request);

        var guid = await userRepository.AddUserAsync(userEntity);

        return new RegisterResponse(guid);
    }
}
