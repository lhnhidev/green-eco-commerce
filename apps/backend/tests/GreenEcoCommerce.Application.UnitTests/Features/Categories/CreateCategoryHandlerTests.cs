using GreenEcoCommerce.Application.Features.Categories;
using GreenEcoCommerce.Application.Features.Categories.Commands;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Interfaces;
using Moq;

namespace GreenEcoCommerce.Application.UnitTests.Features.Categories;

public class CreateCategoryHandlerTests
{
    private readonly Mock<ICategoryRepository> mockRepo;
    private readonly CreateCategoryHandler handler;

    public CreateCategoryHandlerTests()
    {
        mockRepo = new Mock<ICategoryRepository>();
        handler = new CreateCategoryHandler(mockRepo.Object);
    }

    [Fact]
    public async Task Handle_ShouldAddCategoryAndReturnDto()
    {
        // Arrange
        var command = new CategoryPayloadDto("Electronics", "Electronic goods");
        var savedCategory = new Category { Id = Guid.NewGuid(), Name = "Electronics", Description = "Electronic goods" };

        mockRepo
            .Setup(r => r.AddAsync(It.IsAny<Category>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(savedCategory);

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(savedCategory.Id, result.Id);
        Assert.Equal("Electronics", result.Name);
        Assert.Equal("Electronic goods", result.Description);
    }

    [Fact]
    public async Task Handle_ShouldCallAddAsyncOnce()
    {
        // Arrange
        var command = new CategoryPayloadDto("Clothing");
        var savedCategory = new Category { Id = Guid.NewGuid(), Name = "Clothing" };

        mockRepo
            .Setup(r => r.AddAsync(It.IsAny<Category>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(savedCategory);

        // Act
        await handler.Handle(command, CancellationToken.None);

        // Assert
        mockRepo.Verify(r => r.AddAsync(It.IsAny<Category>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_ShouldCreateCategoryWithParentId_WhenParentIdProvided()
    {
        // Arrange
        var parentId = Guid.NewGuid();
        var command = new CategoryPayloadDto("Sub-Electronics", null, parentId);
        var savedCategory = new Category { Id = Guid.NewGuid(), Name = "Sub-Electronics", ParentId = parentId };

        mockRepo
            .Setup(r => r.AddAsync(It.IsAny<Category>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(savedCategory);

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.Equal(parentId, result.ParentId);
    }
}
