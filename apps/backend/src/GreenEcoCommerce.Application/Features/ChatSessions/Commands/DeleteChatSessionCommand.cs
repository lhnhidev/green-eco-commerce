using FluentValidation;
using GreenEcoCommerce.Domain.Exceptions;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.ChatSessions.Commands;

public record DeleteChatSessionCommand(Guid Id, Guid UserId) : IRequest
{
    public class Handler(IChatSessionRepository chatSessionRepository) : IRequestHandler<DeleteChatSessionCommand>
    {
        public async Task Handle(DeleteChatSessionCommand command, CancellationToken ct)
        {
            bool found = await chatSessionRepository.DeleteAsync(command.Id, command.UserId, ct);

            if (!found) { throw new NotFoundException($"Chat session with ID {command.Id} not found."); }
        }
    }

    public class Validator : AbstractValidator<DeleteChatSessionCommand>
    {
        public Validator()
        {
            RuleFor(x => x.Id)
                    .NotEmpty().WithMessage("Chat session ID must be a valid GUID.");

            RuleFor(x => x.UserId)
                    .NotEmpty().WithMessage("User ID must be a valid GUID.");
        }
    }

}
