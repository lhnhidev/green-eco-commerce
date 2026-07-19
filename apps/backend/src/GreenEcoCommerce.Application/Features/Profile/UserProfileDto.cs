using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Enums;
using Riok.Mapperly.Abstractions;

namespace GreenEcoCommerce.Application.Features.Profile;

public record UserProfileDto(
    string Avatar,
    string FirstName,
    string LastName,
    string Email,
    string Phone,
    string Address,
    RoleEnum Role,
    DateTimeOffset CreatedAt
);

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
public static partial class ProfileDtoMapper
{
    public static partial UserProfileDto ToProfileDto(this User profile);
    public static partial IQueryable<UserProfileDto> ProjectToProfileDto(this IQueryable<User> q);
}
