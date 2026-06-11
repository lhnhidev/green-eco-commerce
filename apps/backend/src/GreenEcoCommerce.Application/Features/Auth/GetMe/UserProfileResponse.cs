using AutoMapper;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Enums;

namespace GreenEcoCommerce.Application.Features.Auth.GetMe;

public record UserProfileResponse(
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

public class UserProfileProfile : Profile
{
    public UserProfileProfile()
    {
        CreateMap<User, UserProfileResponse>()
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email.Value))
            .ForMember(dest => dest.Phone, opt => opt.MapFrom(src => src.Phone.Value));
    }
}
