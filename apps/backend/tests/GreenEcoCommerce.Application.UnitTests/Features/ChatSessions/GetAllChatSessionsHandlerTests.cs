using AutoMapper;
using GreenEcoCommerce.Application.Features.ChatSessions;
using GreenEcoCommerce.Application.Features.ChatSessions.Queries;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Interfaces;
using Moq;

namespace GreenEcoCommerce.Application.UnitTests.Features.ChatSessions;

public class GetAllChatSessionsHandlerTests
{
    private readonly Mock<IChatSessionRepository> mockRepo;
    private readonly Mock<IMapper> mockMapper;
    private readonly GetAllChatSessionsHandler handler;

    public GetAllChatSessionsHandlerTests()
    {
        mockRepo = new Mock<IChatSessionRepository>();
        mockMapper = new Mock<IMapper>();
        handler = new GetAllChatSessionsHandler(mockRepo.Object, mockMapper.Object);
    }

    [Fact]
    public async Task Handle_ReturnsAllSessionsForUser()
    {
        var userId = Guid.NewGuid();
        var sessions = new List<ChatSession>
        {
            new() { Id = Guid.NewGuid(), UserId = userId, Title = "Chat 1" },
            new() { Id = Guid.NewGuid(), UserId = userId, Title = "Chat 2" }
        };
        var dtos = sessions
            .Select(s => new ChatSessionDto(s.Id, s.UserId, s.Title, s.CreatedAt))
            .ToList();

        mockRepo
            .Setup(r => r.GetAllByUserIdAsync(userId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(sessions);

        mockMapper
            .Setup(m => m.Map<List<ChatSessionDto>>(sessions))
            .Returns(dtos);

        var result = await handler.Handle(new GetAllChatSessionsQuery(userId), CancellationToken.None);

        Assert.Equal(2, result.Count);
    }

    [Fact]
    public async Task Handle_ShouldCallGetAllByUserIdAsyncOnce()
    {
        var userId = Guid.NewGuid();

        mockRepo
            .Setup(r => r.GetAllByUserIdAsync(userId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<ChatSession>());

        mockMapper
            .Setup(m => m.Map<List<ChatSessionDto>>(It.IsAny<List<ChatSession>>()))
            .Returns(new List<ChatSessionDto>());

        await handler.Handle(new GetAllChatSessionsQuery(userId), CancellationToken.None);

        mockRepo.Verify(r => r.GetAllByUserIdAsync(userId, It.IsAny<CancellationToken>()), Times.Once);
    }
}
