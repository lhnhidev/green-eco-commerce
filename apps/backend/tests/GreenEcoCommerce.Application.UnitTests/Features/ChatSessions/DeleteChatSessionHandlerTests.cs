using GreenEcoCommerce.Application.Features.ChatSessions.Commands;
using GreenEcoCommerce.Domain.Exceptions;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;
using Moq;

namespace GreenEcoCommerce.Application.UnitTests.Features.ChatSessions;

public class DeleteChatSessionHandlerTests
{
    private readonly Mock<IChatSessionRepository> mockRepo;
    private readonly DeleteChatSessionHandler handler;

    public DeleteChatSessionHandlerTests()
    {
        mockRepo = new Mock<IChatSessionRepository>();
        handler = new DeleteChatSessionHandler(mockRepo.Object);
    }

    [Fact]
    public async Task Handle_ShouldReturnUnit_WhenSessionExists()
    {
        var sessionId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var command = new DeleteChatSessionCommand(sessionId, userId);

        mockRepo
            .Setup(r => r.DeleteAsync(sessionId, userId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        var result = await handler.Handle(command, CancellationToken.None);

        Assert.Equal(Unit.Value, result);
        mockRepo.Verify(r => r.DeleteAsync(sessionId, userId, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_ThrowsNotFoundException_WhenSessionNotFound()
    {
        var sessionId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var command = new DeleteChatSessionCommand(sessionId, userId);

        mockRepo
            .Setup(r => r.DeleteAsync(sessionId, userId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        var exception = await Assert.ThrowsAsync<NotFoundException>(
            () => handler.Handle(command, CancellationToken.None));

        Assert.Contains(sessionId.ToString(), exception.Message);
    }

    [Fact]
    public async Task Handle_ShouldScopeDeleteToOwningUser()
    {
        var sessionId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var otherUser = Guid.NewGuid();
        var command = new DeleteChatSessionCommand(sessionId, userId);

        mockRepo
            .Setup(r => r.DeleteAsync(It.IsAny<Guid>(), It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        await handler.Handle(command, CancellationToken.None);

        mockRepo.Verify(r => r.DeleteAsync(sessionId, userId, It.IsAny<CancellationToken>()), Times.Once);
        mockRepo.Verify(r => r.DeleteAsync(sessionId, otherUser, It.IsAny<CancellationToken>()), Times.Never);
    }
}
