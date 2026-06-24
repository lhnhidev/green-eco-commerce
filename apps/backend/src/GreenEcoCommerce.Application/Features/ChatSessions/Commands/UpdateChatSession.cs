using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Exceptions;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.ChatSessions.Commands;

public record UpdateChatSessionCommand(Guid Id, Guid UserId, ChatSessionPayloadDto Dto)
        : IRequest<Unit>;

public class UpdateChatSessionHandler(IChatSessionRepository chatSessionRepository)
        : IRequestHandler<UpdateChatSessionCommand, Unit>
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
