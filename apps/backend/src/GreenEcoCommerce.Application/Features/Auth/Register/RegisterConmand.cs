using AutoMapper;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Exceptions;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Auth.Register
{
    public record RegisterCommand(
        string FirstName,
        string LastName,
        string Phone,
        string AddressDefault,
        string? Role,
        string Email,
        string Password
    ) : IRequest<Guid>;

    public class RegisterHandler : IRequestHandler<RegisterCommand, Guid>
    {
        private readonly IMapper _mapper;
        private readonly IUserRepository _userRepository;

        public RegisterHandler(IUserRepository userRepository, IMapper mapper)
        {
            _mapper = mapper;
            _userRepository = userRepository;            
        }

        public async Task<Guid> Handle(RegisterCommand request, CancellationToken cancellationToken)
        {
            var emailExist = await _userRepository.EmailUserExist(request.Email);

            if (emailExist)
            {
                throw new BadRequestException("Email user is exist");
            }

            var userEntity = _mapper.Map<User>(request);

            var guid = await _userRepository.AddUserAsync(userEntity);

            return guid;
        }
    }
}
