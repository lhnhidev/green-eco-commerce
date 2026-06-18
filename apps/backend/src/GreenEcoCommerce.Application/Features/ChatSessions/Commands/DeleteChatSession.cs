using GreenEcoCommerce.Domain.Exceptions;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.ChatSessions.Commands;

public record DeleteChatSessionCommand(Guid Id, Guid UserId) : IRequest<Unit>;

public class DeleteChatSessionHandler(IChatSessionRepository chatSessionRepository)
        : IRequestHandler<DeleteChatSessionCommand, Unit>
{
    public async Task<Unit> Handle(DeleteChatSessionCommand command, CancellationToken ct)
    {
        bool found = await chatSessionRepository.DeleteAsync(command.Id, command.UserId, ct);

        return found ? Unit.Value : throw new NotFoundException($"Chat session with ID {command.Id} not found.");
    }
}
