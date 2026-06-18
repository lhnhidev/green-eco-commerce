using AutoMapper;
using GreenEcoCommerce.Application.Features.ChatSessions;
using GreenEcoCommerce.Application.Features.ChatSessions.Queries;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Exceptions;
using GreenEcoCommerce.Domain.Interfaces;
using Moq;

namespace GreenEcoCommerce.Application.UnitTests.Features.ChatSessions;

public class GetChatSessionByIdHandlerTests
{
    private readonly Mock<IChatSessionRepository> mockRepo;
    private readonly Mock<IMapper> mockMapper;
    private readonly GetChatSessionById handler;

    public GetChatSessionByIdHandlerTests()
    {
        mockRepo = new Mock<IChatSessionRepository>();
        mockMapper = new Mock<IMapper>();
        handler = new GetChatSessionById(mockRepo.Object, mockMapper.Object);
    }

    [Fact]
    public async Task Handle_ReturnsChatSessionDto_WhenSessionExists()
    {
        var userId = Guid.NewGuid();
        var sessionId = Guid.NewGuid();
        var session = new ChatSession { Id = sessionId, UserId = userId, Title = "Existing chat" };
        var expectedDto = new ChatSessionDto(sessionId, userId, "Existing chat", session.CreatedAt);

        mockRepo
            .Setup(r => r.GetByIdAsync(sessionId, userId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(session);

        mockMapper
            .Setup(m => m.Map<ChatSessionDto>(session))
            .Returns(expectedDto);

        var result = await handler.Handle(new GetChatSessionByIdQuery(sessionId, userId), CancellationToken.None);

        Assert.NotNull(result);
        Assert.Equal(sessionId, result.Id);
        Assert.Equal("Existing chat", result.Title);
    }

    [Fact]
    public async Task Handle_ThrowsNotFoundException_WhenSessionDoesNotExist()
    {
        var userId = Guid.NewGuid();
        var sessionId = Guid.NewGuid();

        mockRepo
            .Setup(r => r.GetByIdAsync(sessionId, userId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((ChatSession?)null);

        var exception = await Assert.ThrowsAsync<NotFoundException>(
            () => handler.Handle(new GetChatSessionByIdQuery(sessionId, userId), CancellationToken.None));

        Assert.Equal("Not found chat session", exception.Message);
    }

    [Fact]
    public async Task Handle_ShouldNotCallMapper_WhenSessionDoesNotExist()
    {
        var userId = Guid.NewGuid();
        var sessionId = Guid.NewGuid();

        mockRepo
            .Setup(r => r.GetByIdAsync(sessionId, userId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((ChatSession?)null);

        await Assert.ThrowsAsync<NotFoundException>(
            () => handler.Handle(new GetChatSessionByIdQuery(sessionId, userId), CancellationToken.None));

        mockMapper.Verify(m => m.Map<ChatSessionDto>(It.IsAny<ChatSession>()), Times.Never);
    }
}
