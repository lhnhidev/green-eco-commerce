using GreenEcoCommerce.Application.Features.Chatbot;
using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Domain.Enums;
using GreenEcoCommerce.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.ChatSessions.Queries;

public record GetChatSessionMessagesQuery(Guid SessionId, Guid UserId) : IRequest<ChatMessageDto[]>
{
    public class Handler(IApplicationDbContext dbContext) : IRequestHandler<GetChatSessionMessagesQuery, ChatMessageDto[]>
    {
        public async Task<ChatMessageDto[]> Handle(GetChatSessionMessagesQuery request, CancellationToken ct)
        {
            bool sessionExists = await dbContext.ChatSessions
                    .AnyAsync(s => s.Id == request.SessionId && s.UserId == request.UserId, ct);

            if (!sessionExists)
            {
                throw new NotFoundException($"Chat session {request.SessionId} not found.");
            }

            var messages = await dbContext.ChatMessages
                    .Where(m => m.SessionId == request.SessionId)
                    .OrderBy(m => m.CreatedAt)
                    .Select(m => new ChatMessageDto(m.Role == ChatRoleEnum.Bot ? ChatRole.Bot : ChatRole.User, m.Content))
                    .ToArrayAsync(ct);

            return messages;
        }
    }
}
