using FluentValidation;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Enums;
using GreenEcoCommerce.Domain.ValueObjects;
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
): IRequest<UserDto>
{
    public class Validator : AbstractValidator<UserPayloadDto>
    {
        public Validator()
        {
            RuleFor(x => x.FirstName)
                    .NotEmpty().WithMessage("First name is required.")
                    .MinimumLength(2).WithMessage("First name must be at least 2 characters long.")
                    .MaximumLength(80).WithMessage("First name must not exceed 80 characters.");

            RuleFor(x => x.LastName)
                    .NotEmpty().WithMessage("Last name is required.")
                    .MinimumLength(2).WithMessage("Last name must be at least 2 characters long.")
                    .MaximumLength(80).WithMessage("Last name must not exceed 80 characters.");

            RuleFor(x => x.Phone)
                    .NotEmpty().WithMessage("Phone number is required.").Length(10)
                    .WithMessage("Phone number must be exactly 10 digits long.")
                    .Must(phoneStr => PhoneNumber.TryFrom(phoneStr, out _)).WithMessage("Phone number must be valid.");

            RuleFor(x => x.Address)
                    .NotEmpty().WithMessage("Address is required.")
                    .MinimumLength(5).WithMessage("Address must be at least 5 characters long.")
                    .MaximumLength(500).WithMessage("Address must not exceed 500 characters.");

            RuleFor(x => x.Email)
                    .NotEmpty().WithMessage("Email is required.")
                    .Must(emailStr => Domain.ValueObjects.Email.TryFrom(emailStr, out _))
                    .WithMessage("Email must be a valid email address.");

            RuleFor(x => x.Password)
                    .NotEmpty().WithMessage("Password is required.")
                    .MinimumLength(6).WithMessage("Password must be at least 6 characters long.")
                    .Matches("[A-Z]").WithMessage("Password must contain at least one uppercase letter.")
                    .Matches("[a-z]").WithMessage("Password must contain at least one lowercase letter.")
                    .Matches("[0-9]").WithMessage("Password must contain at least one digit.")
                    .Matches("[^a-zA-Z0-9]").WithMessage("Password must contain at least one special character.");
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
