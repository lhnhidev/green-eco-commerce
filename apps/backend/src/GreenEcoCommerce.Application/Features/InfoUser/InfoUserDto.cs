using AutoMapper;
using GreenEcoCommerce.Application.Features.InfoUser.Commands;
using GreenEcoCommerce.Domain.Entities;

namespace GreenEcoCommerce.Application.Features.InfoUser;

public record UpdateInfoUserResponse(
    Guid Id,
    string Avatar,
    string Email,
    string FirstName,
    string LastName,
    string Phone,
    string Address
);

public record UpdateInfoUserDto(
    string Avatar,
    string Email,
    string FirstName,
    string LastName,
    string Phone,
    string Address
);

public class InfoUserProfile : Profile
{
    public InfoUserProfile()
    {
        CreateMap<UpdateInfoUserCommand, User>()
            .IncludeMembers(src => src.Dto);
        CreateMap<User, UpdateInfoUserResponse>();
        CreateMap<UpdateInfoUserDto, User>();
    }
}
