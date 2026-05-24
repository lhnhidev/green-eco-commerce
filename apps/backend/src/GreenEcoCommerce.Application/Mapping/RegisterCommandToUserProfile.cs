using AutoMapper;
using GreenEcoCommerce.Application.Features.Auth.Register;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Enums;
using GreenEcoCommerce.Domain.ValueObjects;

namespace GreenEcoCommerce.Application.Mapping
{
    public class RegisterCommandToUserProfile : Profile
    {
        public RegisterCommandToUserProfile()
        {
            CreateMap<RegisterCommand, User>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(_ => Guid.NewGuid()))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => Email.Create(src.Email)))
                .ForMember(dest => dest.PasswordHash, opt => opt.MapFrom(src => BCrypt.Net.BCrypt.HashPassword(src.Password)))
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.FirstName + " " + src.LastName))
                .ForMember(dest => dest.Phone, opt => opt.MapFrom(src => PhoneNumber.Create(src.Phone)))
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role == null ? RoleEnum.User : Enum.Parse<RoleEnum>(src.Role, true)))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(_ => DateTime.UtcNow));
        }
    }
}
