using FluentValidation;
using GreenEcoCommerce.Application.Features.Users;
using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Exceptions;
using GreenEcoCommerce.Domain.ValueObjects;
using MediatR;
using Riok.Mapperly.Abstractions;

namespace GreenEcoCommerce.Application.Features.Profile.Commands;

public partial record UpdateUserProfileCommand(
    Guid Id,
    string Avatar,
    string FirstName,
    string LastName,
    string Password,
    string Phone,
    string Address
) : IRequest<UserProfileDto>
{
    public class Handler(IApplicationDbContext dbContext) : IRequestHandler<UpdateUserProfileCommand, UserProfileDto>
    {
        public async Task<UserProfileDto> Handle(UpdateUserProfileCommand command, CancellationToken ct)
        {
            var user = await dbContext.Users.FindAsync([command.Id], ct) ??
                       throw new NotFoundException($"User with ID {command.Id} not found.");

            Mapper.ApplyUpdate(command, user);
            await dbContext.SaveChangesAsync(ct);

            return user.ToProfileDto();
        }
    }

    [Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Source)]
    public static partial class Mapper
    {
        [MapperIgnoreSource(nameof(Id))]
        [MapProperty(nameof(Password), nameof(User.PasswordHash), Use = nameof(@UserDtoMapper.UpdatePasswordHash))]
        public static partial void ApplyUpdate(UpdateUserProfileCommand command, User profile);
    }

    public class Validator : AbstractValidator<UpdateUserProfileCommand>
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
                    .NotEmpty().WithMessage("Phone number is required.")
                    .Length(10).WithMessage("Phone number must be exactly 10 digits long.")
                    .Must(phoneStr => PhoneNumber.TryFrom(phoneStr, out _)).WithMessage("Phone number must be valid.");

            RuleFor(x => x.Address)
                    .NotEmpty().WithMessage("Address is required.")
                    .MinimumLength(5).WithMessage("Address must be at least 5 characters long.")
                    .MaximumLength(500).WithMessage("Address must not exceed 500 characters.");
        }
    }
}
