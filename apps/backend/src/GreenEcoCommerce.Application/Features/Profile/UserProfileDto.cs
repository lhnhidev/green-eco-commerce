using FluentValidation;
using GreenEcoCommerce.Application.Features.Users;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Enums;
using GreenEcoCommerce.Domain.ValueObjects;
using Riok.Mapperly.Abstractions;

namespace GreenEcoCommerce.Application.Features.Profile;

public record UserProfilePayloadDto(
    string Avatar,
    string FirstName,
    string LastName,
    string Password,
    string Phone,
    string Address
)
{
    // Dùng riêng cho self-update profile: password không bắt buộc (để trống = giữ nguyên).
    public class Validator : Validator<UserProfilePayloadDto>
    {
        protected override bool RequirePassword => false;
    }

    // Validator generic để các payload kế thừa (vd UserPayloadDto khi đăng ký) dùng lại
    // đúng bộ rule cho FirstName/LastName/Phone/Address/Password.
    public class Validator<T> : AbstractValidator<T> where T : UserProfilePayloadDto
    {
        protected virtual bool RequirePassword => true;

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

            RuleFor(x => x.Password)
                    .NotEmpty().WithMessage("Password is required.")
                    .MinimumLength(6).WithMessage("Password must be at least 6 characters long.")
                    .Matches("[A-Z]").WithMessage("Password must contain at least one uppercase letter.")
                    .Matches("[a-z]").WithMessage("Password must contain at least one lowercase letter.")
                    .Matches("[0-9]").WithMessage("Password must contain at least one digit.")
                    .Matches("[^a-zA-Z0-9]").WithMessage("Password must contain at least one special character.")
                    .When(x => RequirePassword || !string.IsNullOrEmpty(x.Password));
        }
    }
}

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

    [MapperRequiredMapping(RequiredMappingStrategy.Source)]
    [MapProperty(nameof(UserProfilePayloadDto.Password), nameof(User.PasswordHash), Use = nameof(@UserDtoMapper.UpdatePasswordHash))]
    public static partial void UpdateProfile([MappingTarget] this User user, UserProfilePayloadDto payload);
}
