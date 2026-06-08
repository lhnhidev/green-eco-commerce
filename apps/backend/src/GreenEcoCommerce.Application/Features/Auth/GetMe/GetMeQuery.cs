using AutoMapper;
using GreenEcoCommerce.Domain.Exceptions;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Auth.GetMe;

public record GetMeQuery(Guid UserId) : IRequest<UserProfileResponse>;

public class GetMeHandler(IUserRepository userRepository, IMapper mapper) : IRequestHandler<GetMeQuery, UserProfileResponse>
{
    public async Task<UserProfileResponse> Handle(GetMeQuery request, CancellationToken ct)
    {
        var user = await userRepository.GetUserByIdAsync(request.UserId);

        return user != null ? mapper.Map<UserProfileResponse>(user) : throw new NotFoundException("User not found");
    }
}
