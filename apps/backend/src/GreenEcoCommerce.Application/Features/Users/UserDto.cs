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
    // Kế thừa validator generic của UserProfilePayloadDto để tái sử dụng đầy đủ rule
    // FirstName/LastName/Phone/Address/Password, rồi bổ sung thêm rule Email + Role.
    // Nhờ vậy luồng đăng ký (RegisterPayload -> UserPayloadDto) và admin tạo/sửa user
    // đều được validate đầy đủ, không còn bỏ sót như trước.
    public new class Validator : UserProfilePayloadDto.Validator<UserPayloadDto>
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

// Avatar không bắt buộc khi đăng ký. Phải khai báo nullable thì bộ sinh OpenAPI mới
// loại nó khỏi "required" — chỉ đặt giá trị mặc định là không đủ.
public record RegisterPayload(string FirstName, string LastName, string Phone, string Address, string Email, string Password, string? Avatar = null);

public record UserDto(
    Guid Id,
    string Avatar,
    string Email,
    string FirstName,
    string LastName,
    string Phone,
    string Address,
    RoleEnum Role,
    bool IsActive,
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
    [MapProperty(nameof(RegisterPayload.Avatar), nameof(UserPayloadDto.Avatar), Use = nameof(AvatarOrEmpty))]
    public static partial UserPayloadDto ToUserPayloadDto(this RegisterPayload request);

    // Avatar là tuỳ chọn khi đăng ký; entity User mặc định dùng chuỗi rỗng.
    [UserMapping(Default = false)]
    public static string AvatarOrEmpty(string? avatar) => avatar ?? string.Empty;

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
