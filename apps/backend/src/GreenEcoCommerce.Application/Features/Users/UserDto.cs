using FluentValidation;
using GreenEcoCommerce.Application.Features.Profile;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Enums;
using MediatR;
using Riok.Mapperly.Abstractions;

namespace GreenEcoCommerce.Application.Features.Users;

public record UserPayloadDto(
    string Avatar,
    string Email,
    string Password,
    string FirstName,
    string LastName,
    string Phone,
    string Address,
    RoleEnum Role
): UserProfilePayloadDto(Avatar, FirstName, LastName, Password, Phone, Address), IRequest<UserDto>
{
    public new class Validator : AbstractValidator<UserPayloadDto>
    {
        public Validator()
        {
            RuleFor(x => x.Email)
                    .NotEmpty().WithMessage("Email is required.")
                    .Must(emailStr => Domain.ValueObjects.Email.TryFrom(emailStr, out _))
                    .WithMessage("Email must be a valid email address.");

            RuleFor(x => x.Role)
                .IsInEnum().WithMessage("Role must be a valid role.");
        }
    }
}

public record RegisterPayload(string Avatar, string FirstName, string LastName, string Phone, string Address, string Email, string Password);

public record UserDto(
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

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Source)]
public static partial class UserDtoMapper
{
    [MapperRequiredMapping(RequiredMappingStrategy.Target)]
    public static partial UserDto ToDto(this User user);
    public static partial IQueryable<UserDto> ProjectToDto(this IQueryable<User> q);

    [MapProperty(nameof(UserPayloadDto.Password), nameof(User.PasswordHash), Use = nameof(UpdatePasswordHash))]
    public static partial void ApplyUpdate([MappingTarget] this User profile, UserPayloadDto command);
    [MapProperty(nameof(UserPayloadDto.Password), nameof(User.PasswordHash), Use = nameof(MapPasswordToHash))]
    public static partial User ToEntity(this UserPayloadDto request);

    [MapValue(nameof(UserPayloadDto.Role), RoleEnum.User)]
    public static partial UserPayloadDto ToUserPayloadDto(this RegisterPayload request);

    [UserMapping(Default = false)]
    public static void UpdatePasswordHash([MappingTarget] ref string passwordHash, string? password)
    {
        if (!string.IsNullOrEmpty(password))
        {
            passwordHash = BCrypt.Net.BCrypt.HashPassword(password);
        }
    }
    [UserMapping(Default = false)]
    private static string MapPasswordToHash(string password) => BCrypt.Net.BCrypt.HashPassword(password);
}
