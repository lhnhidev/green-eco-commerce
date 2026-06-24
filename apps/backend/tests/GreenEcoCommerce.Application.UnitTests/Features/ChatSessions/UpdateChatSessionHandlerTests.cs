using GreenEcoCommerce.Application.Features.ChatSessions;
using GreenEcoCommerce.Application.Features.ChatSessions.Commands;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Exceptions;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;
using Moq;

namespace GreenEcoCommerce.Application.UnitTests.Features.ChatSessions;

public class UpdateChatSessionHandlerTests
{
    private readonly Mock<IChatSessionRepository> mockRepo;
    private readonly UpdateChatSessionHandler handler;

    public UpdateChatSessionHandlerTests()
    {
        mockRepo = new Mock<IChatSessionRepository>();
        handler = new UpdateChatSessionHandler(mockRepo.Object);
    }

    [Fact]
    public async Task Handle_ShouldReturnUnit_WhenSessionExists()
    {
        var sessionId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var command = new UpdateChatSessionCommand(sessionId, userId, new ChatSessionPayloadDto("Renamed chat"));

        mockRepo
            .Setup(r => r.UpdateAsync(It.IsAny<ChatSession>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        var result = await handler.Handle(command, CancellationToken.None);

        Assert.Equal(Unit.Value, result);
    }

    [Fact]
    public async Task Handle_ThrowsNotFoundException_WhenSessionNotFound()
    {
        var sessionId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var command = new UpdateChatSessionCommand(sessionId, userId, new ChatSessionPayloadDto("Missing"));

        mockRepo
            .Setup(r => r.UpdateAsync(It.IsAny<ChatSession>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        var exception = await Assert.ThrowsAsync<NotFoundException>(
            () => handler.Handle(command, CancellationToken.None));

        Assert.Contains(sessionId.ToString(), exception.Message);
        Assert.Contains("not found", exception.Message, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task Handle_ShouldCallUpdateAsyncOnce_WithCorrectIdAndUser()
    {
        var sessionId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var command = new UpdateChatSessionCommand(sessionId, userId, new ChatSessionPayloadDto("New title"));

        mockRepo
            .Setup(r => r.UpdateAsync(It.IsAny<ChatSession>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        await handler.Handle(command, CancellationToken.None);

        mockRepo.Verify(r => r.UpdateAsync(
            It.Is<ChatSession>(s => s.Id == sessionId && s.UserId == userId && s.Title == "New title"),
            It.IsAny<CancellationToken>()), Times.Once);
    }
}
