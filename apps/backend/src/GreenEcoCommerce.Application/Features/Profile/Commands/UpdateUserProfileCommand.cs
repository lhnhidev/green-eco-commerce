using FluentValidation;
using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Domain.Exceptions;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Profile.Commands;

public record UpdateUserProfileCommand(
    Guid Id,
    UserProfilePayloadDto Payload
) : IRequest<UserProfileDto>
{
    public class Handler(IApplicationDbContext dbContext) : IRequestHandler<UpdateUserProfileCommand, UserProfileDto>
    {
        public async Task<UserProfileDto> Handle(UpdateUserProfileCommand command, CancellationToken ct)
        {
            var user = await dbContext.Users.FindAsync([command.Id], ct) ??
                       throw new NotFoundException($"User with ID {command.Id} not found.");

            user.UpdateProfile(command.Payload);
            await dbContext.SaveChangesAsync(ct);

            return user.ToProfileDto();
        }
    }

    public class Validator : AbstractValidator<UpdateUserProfileCommand>
    {
        public Validator()
        {
            RuleFor(x => x.Payload).SetValidator(new UserProfilePayloadDto.Validator());
        }
    }
}
