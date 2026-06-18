using AutoMapper;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.ChatSessions.Commands;

public record CreateChatSessionCommand(Guid UserId, ChatSessionPayloadDto Dto)
        : IRequest<ChatSessionDto>;

public class CreateChatSessionHandler(IChatSessionRepository chatSessionRepository, IMapper mapper)
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

        return mapper.Map<ChatSessionDto>(created);
    }
}
