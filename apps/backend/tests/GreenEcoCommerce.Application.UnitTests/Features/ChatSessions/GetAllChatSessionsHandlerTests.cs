using GreenEcoCommerce.Application.Features.ChatSessions;
using GreenEcoCommerce.Application.Features.ChatSessions.Queries;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Interfaces;
using Moq;

namespace GreenEcoCommerce.Application.UnitTests.Features.ChatSessions;

public class GetAllChatSessionsHandlerTests
{
    private readonly Mock<IChatSessionRepository> mockRepo;
    private readonly GetAllChatSessionsQuery.Handler handler;

    public GetAllChatSessionsHandlerTests()
    {
        mockRepo = new Mock<IChatSessionRepository>();
        handler = new GetAllChatSessionsQuery.Handler(mockRepo.Object);
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

        var result = await handler.Handle(new GetAllChatSessionsQuery(userId), CancellationToken.None);

        Assert.Equal(2, result.Length);
        Assert.Equal(dtos, result);
    }

    [Fact]
    public async Task Handle_ShouldCallGetAllByUserIdAsyncOnce()
    {
        var userId = Guid.NewGuid();

        mockRepo
            .Setup(r => r.GetAllByUserIdAsync(userId, It.IsAny<CancellationToken>()))
            .ReturnsAsync([]);

        await handler.Handle(new GetAllChatSessionsQuery(userId), CancellationToken.None);

        mockRepo.Verify(r => r.GetAllByUserIdAsync(userId, It.IsAny<CancellationToken>()), Times.Once);
    }
}
