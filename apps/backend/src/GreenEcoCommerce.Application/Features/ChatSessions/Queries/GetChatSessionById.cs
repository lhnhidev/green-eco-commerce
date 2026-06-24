using AutoMapper;
using GreenEcoCommerce.Domain.Exceptions;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.ChatSessions.Queries;

public record GetChatSessionByIdQuery(Guid Id, Guid UserId) : IRequest<ChatSessionDto>;

public class GetChatSessionById(IChatSessionRepository chatSessionRepository, IMapper mapper)
        : IRequestHandler<GetChatSessionByIdQuery, ChatSessionDto>
{
    public async Task<ChatSessionDto> Handle(GetChatSessionByIdQuery request, CancellationToken ct)
    {
        var session = await chatSessionRepository.GetByIdAsync(request.Id, request.UserId, ct);

        return session != null ? mapper.Map<ChatSessionDto>(session) : throw new NotFoundException("Not found chat session");
    }
}
