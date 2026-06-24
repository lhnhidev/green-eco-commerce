using AutoMapper;
using GreenEcoCommerce.Domain.Entities;
using MediatR;

namespace GreenEcoCommerce.Application.Features.ChatSessions;

public record ChatSessionPayloadDto(string Title);

public record ChatSessionDto(
    Guid Id,
    Guid UserId,
    string Title,
    DateTimeOffset CreatedAt
);

public class ChatSessionDtoProfile : Profile
{
    public ChatSessionDtoProfile()
    {
        CreateMap<ChatSessionPayloadDto, ChatSession>();
        CreateMap<ChatSession, ChatSessionDto>();
    }
}
