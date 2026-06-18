using AutoMapper;
using GreenEcoCommerce.Application.Features.ChatSessions;
using GreenEcoCommerce.Application.Features.ChatSessions.Commands;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Interfaces;
using Moq;

namespace GreenEcoCommerce.Application.UnitTests.Features.ChatSessions;

public class CreateChatSessionHandlerTests
{
    private readonly Mock<IChatSessionRepository> mockRepo;
    private readonly Mock<IMapper> mockMapper;
    private readonly CreateChatSessionHandler handler;

    public CreateChatSessionHandlerTests()
    {
        mockRepo = new Mock<IChatSessionRepository>();
        mockMapper = new Mock<IMapper>();
        handler = new CreateChatSessionHandler(mockRepo.Object, mockMapper.Object);
    }

    [Fact]
    public async Task Handle_ShouldAddChatSessionAndReturnDto()
    {
        var userId = Guid.NewGuid();
        var command = new CreateChatSessionCommand(userId, new ChatSessionPayloadDto("My first chat"));
        var savedId = Guid.NewGuid();
        var savedAt = DateTimeOffset.UtcNow;
        var savedSession = new ChatSession { Id = savedId, UserId = userId, Title = "My first chat", CreatedAt = savedAt };
        var expectedDto = new ChatSessionDto(savedId, userId, "My first chat", savedAt);

        mockRepo
            .Setup(r => r.AddAsync(It.IsAny<ChatSession>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(savedSession);

        mockMapper
            .Setup(m => m.Map<ChatSessionDto>(savedSession))
            .Returns(expectedDto);

        var result = await handler.Handle(command, CancellationToken.None);

        Assert.NotNull(result);
        Assert.Equal(savedId, result.Id);
        Assert.Equal(userId, result.UserId);
        Assert.Equal("My first chat", result.Title);
    }

    [Fact]
    public async Task Handle_ShouldCallAddAsyncOnce_WithUserIdFromCommand()
    {
        var userId = Guid.NewGuid();
        var command = new CreateChatSessionCommand(userId, new ChatSessionPayloadDto("Session A"));
        var savedSession = new ChatSession { Id = Guid.NewGuid(), UserId = userId, Title = "Session A" };

        mockRepo
            .Setup(r => r.AddAsync(It.IsAny<ChatSession>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(savedSession);

        mockMapper
            .Setup(m => m.Map<ChatSessionDto>(savedSession))
            .Returns(new ChatSessionDto(savedSession.Id, userId, "Session A", DateTimeOffset.UtcNow));

        await handler.Handle(command, CancellationToken.None);

        mockRepo.Verify(r => r.AddAsync(
            It.Is<ChatSession>(s => s.UserId == userId && s.Title == "Session A"),
            It.IsAny<CancellationToken>()), Times.Once);
    }
}
