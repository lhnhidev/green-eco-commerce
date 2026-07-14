using FluentValidation;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Exceptions;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.ChatSessions.Commands;

public record UpdateChatSessionCommand(Guid Id, Guid UserId, ChatSessionPayloadDto Dto) : IRequest<Unit>
{
    public class Handler(IChatSessionRepository chatSessionRepository) : IRequestHandler<UpdateChatSessionCommand, Unit>
    {
        public async Task<Unit> Handle(UpdateChatSessionCommand command, CancellationToken ct)
        {
            var session = new ChatSession
            {
                Id = command.Id,
                UserId = command.UserId,
                Title = command.Dto.Title
            };

            bool found = await chatSessionRepository.UpdateAsync(session, ct);

            return found ? Unit.Value : throw new NotFoundException($"Chat session with ID {command.Id} not found.");
        }
    }

    public class Validator : AbstractValidator<UpdateChatSessionCommand>
    {
        public Validator()
        {
            RuleFor(x => x.Id)
                    .NotEmpty().WithMessage("Chat session ID is required.")
                    .Must(id => id != Guid.Empty).WithMessage("Chat session ID must be a valid GUID.");

            RuleFor(x => x.UserId)
                    .NotEmpty().WithMessage("User ID is required.")
                    .Must(id => id != Guid.Empty).WithMessage("User ID must be a valid GUID.");

            RuleFor(x => x.Dto.Title)
                    .NotEmpty().WithMessage("Chat session title is required.")
                    .MinimumLength(2).WithMessage("Chat session title must be at least 2 characters long.")
                    .MaximumLength(255).WithMessage("Chat session title must not exceed 255 characters.");
        }
    }

}
