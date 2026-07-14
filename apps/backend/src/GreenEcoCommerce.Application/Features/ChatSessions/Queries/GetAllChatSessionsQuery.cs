using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.ChatSessions.Queries;

public record GetAllChatSessionsQuery(Guid UserId) : IRequest<ChatSessionDto[]>
{
    public class Handler(IChatSessionRepository chatSessionRepository)
            : IRequestHandler<GetAllChatSessionsQuery, ChatSessionDto[]>
    {
        public async Task<ChatSessionDto[]> Handle(GetAllChatSessionsQuery request, CancellationToken ct)
        {
            var sessions = await chatSessionRepository.GetAllByUserIdAsync(request.UserId, ct);
            return sessions.Select(ChatSessionDtoMapper.ToDto).ToArray();
        }
    }
}
