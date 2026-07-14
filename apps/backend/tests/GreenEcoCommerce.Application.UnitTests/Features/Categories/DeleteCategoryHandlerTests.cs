using GreenEcoCommerce.Application.Features.Categories.Commands;
using GreenEcoCommerce.Domain.Interfaces;
using Moq;

namespace GreenEcoCommerce.Application.UnitTests.Features.Categories;

public class DeleteCategoryHandlerTests
{
    private readonly Mock<ICategoryRepository> mockRepo;
    private readonly DeleteCategoryCommand.Handler handler;

    public DeleteCategoryHandlerTests()
    {
        mockRepo = new Mock<ICategoryRepository>();
        handler = new DeleteCategoryCommand.Handler(mockRepo.Object);
    }

    [Fact]
    public async Task Handle_ShouldCallDeleteAsync_AndReturnUnit()
    {
        // Arrange
        var categoryId = Guid.NewGuid();
        var command = new DeleteCategoryCommand(categoryId);

        mockRepo
            .Setup(r => r.DeleteAsync(categoryId, It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        // Act
        await handler.Handle(command, CancellationToken.None);

        // Assert
        mockRepo.Verify(r => r.DeleteAsync(categoryId, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_ShouldCallDeleteAsyncOnce()
    {
        // Arrange
        var categoryId = Guid.NewGuid();
        var command = new DeleteCategoryCommand(categoryId);

        mockRepo
            .Setup(r => r.DeleteAsync(categoryId, It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        // Act
        await handler.Handle(command, CancellationToken.None);

        // Assert
        mockRepo.Verify(r => r.DeleteAsync(categoryId, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_ShouldNotCallDeleteAsync_ForDifferentId()
    {
        // Arrange
        var categoryId = Guid.NewGuid();
        var differentId = Guid.NewGuid();
        var command = new DeleteCategoryCommand(categoryId);

        mockRepo
            .Setup(r => r.DeleteAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        // Act
        await handler.Handle(command, CancellationToken.None);

        // Assert - verify it was called with the correct ID, not any other
        mockRepo.Verify(r => r.DeleteAsync(categoryId, It.IsAny<CancellationToken>()), Times.Once);
        mockRepo.Verify(r => r.DeleteAsync(differentId, It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task Handle_ShouldReturnUnitValue_Always()
    {
        // Arrange
        var command = new DeleteCategoryCommand(Guid.NewGuid());

        mockRepo
            .Setup(r => r.DeleteAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        // Act
        await handler.Handle(command, CancellationToken.None);

        // Assert
        // No assertion needed as the method should return Task.CompletedTask
    }
}
