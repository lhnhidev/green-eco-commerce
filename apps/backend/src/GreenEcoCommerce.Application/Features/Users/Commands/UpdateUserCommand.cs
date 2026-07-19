using FluentValidation;
using GreenEcoCommerce.Application.Features.Profile;
using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Domain.Exceptions;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Users.Commands;

public record UpdateUserCommand(Guid Id, UserPayloadDto Dto) : IRequest<UserProfileDto>
{
    public class Handler(IApplicationDbContext dbContext) : IRequestHandler<UpdateUserCommand, UserProfileDto>
    {
        public async Task<UserProfileDto> Handle(UpdateUserCommand command, CancellationToken ct)
        {
            var user = await dbContext.Users.FindAsync([command.Id], ct) ??
                       throw new NotFoundException($"User with ID {command.Id} not found.");

            user.ApplyUpdate(command.Dto);
            await dbContext.SaveChangesAsync(ct);

            return user.ToProfileDto();
        }
    }

    public class Validator : AbstractValidator<UpdateUserCommand>
    {
        public Validator() { RuleFor(x => x.Dto).SetValidator(new UserPayloadDto.Validator()); }
    }
}
