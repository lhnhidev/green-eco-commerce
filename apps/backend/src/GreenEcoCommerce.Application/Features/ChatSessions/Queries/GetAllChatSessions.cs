using AutoMapper;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.ChatSessions.Queries;

public record GetAllChatSessionsQuery(Guid UserId) : IRequest<List<ChatSessionDto>>;

public class GetAllChatSessionsHandler(IChatSessionRepository chatSessionRepository, IMapper mapper)
        : IRequestHandler<GetAllChatSessionsQuery, List<ChatSessionDto>>
{
    public async Task<List<ChatSessionDto>> Handle(GetAllChatSessionsQuery request, CancellationToken ct)
    {
        var sessions = await chatSessionRepository.GetAllByUserIdAsync(request.UserId, ct);
        return mapper.Map<List<ChatSessionDto>>(sessions);
    }
}
