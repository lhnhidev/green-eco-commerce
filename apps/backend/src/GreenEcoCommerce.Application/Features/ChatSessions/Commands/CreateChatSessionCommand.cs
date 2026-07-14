using FluentValidation;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.ChatSessions.Commands;

public record CreateChatSessionCommand(Guid UserId, ChatSessionPayloadDto Dto) : IRequest<ChatSessionDto>
{
    public class Handler(IChatSessionRepository chatSessionRepository)
            : IRequestHandler<CreateChatSessionCommand, ChatSessionDto>
    {
        public async Task<ChatSessionDto> Handle(CreateChatSessionCommand command, CancellationToken ct)
        {
            var session = new ChatSession
            {
                UserId = command.UserId,
                Title = command.Dto.Title
            };

            var created = await chatSessionRepository.AddAsync(session, ct);

            return created.ToDto();
        }
    }

    public class Validator : AbstractValidator<CreateChatSessionCommand>
    {
        public Validator()
        {
            RuleFor(x => x.UserId).NotEmpty().WithMessage("User ID is required.").Must(id => id != Guid.Empty)
                    .WithMessage("User ID must be a valid GUID.");

            RuleFor(x => x.Dto.Title).NotEmpty().WithMessage("Chat session title is required.").MinimumLength(2)
                    .WithMessage("Chat session title must be at least 2 characters long.").MaximumLength(255)
                    .WithMessage("Chat session title must not exceed 255 characters.");
        }
    }
}
