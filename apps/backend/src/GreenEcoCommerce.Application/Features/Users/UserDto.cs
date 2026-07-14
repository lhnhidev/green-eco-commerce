using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Enums;
using Riok.Mapperly.Abstractions;

namespace GreenEcoCommerce.Application.Features.Users;

public record UserDto(
    Guid Id,
    string Avatar,
    string Email,
    string PasswordHash,
    string FirstName,
    string LastName,
    string Phone,
    string Address,
    RoleEnum Role,
    DateTimeOffset CreatedAt
);

[Mapper]
public static partial class UserDtoMapper
{
    public static partial UserDto ToDto(this User user);
}
