using FluentValidation;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Exceptions;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.ChatSessions.Commands;

public record UpdateChatSessionCommand(Guid Id, Guid UserId, ChatSessionPayloadDto Dto) : IRequest
{
    public class Handler(IChatSessionRepository chatSessionRepository) : IRequestHandler<UpdateChatSessionCommand>
    {
        public async Task Handle(UpdateChatSessionCommand command, CancellationToken ct)
        {
            var session = new ChatSession
            {
                Id = command.Id,
                UserId = command.UserId,
                Title = command.Dto.Title
            };

            bool found = await chatSessionRepository.UpdateAsync(session, ct);

            if (!found) { throw new NotFoundException($"Chat session with ID {command.Id} not found."); }
        }
    }

    public class Validator : AbstractValidator<UpdateChatSessionCommand>
    {
        public Validator()
        {
            RuleFor(x => x.Id)
                    .NotEmpty().WithMessage("Chat session ID must be a valid GUID.");

            RuleFor(x => x.UserId)
                    .NotEmpty().WithMessage("User ID must be a valid GUID.");

            RuleFor(x => x.Dto).SetValidator(new ChatSessionPayloadDto.Validator());
        }
    }

}
