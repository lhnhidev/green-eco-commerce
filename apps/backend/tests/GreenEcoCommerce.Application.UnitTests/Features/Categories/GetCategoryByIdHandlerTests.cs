using GreenEcoCommerce.Application.Features.Categories.Queries;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Exceptions;
using GreenEcoCommerce.Domain.Interfaces;
using Moq;

namespace GreenEcoCommerce.Application.UnitTests.Features.Categories;

public class GetCategoryByIdHandlerTests
{
    private readonly Mock<ICategoryRepository> mockRepo;
    private readonly GetCategoryByIdQuery.Handler handler;

    public GetCategoryByIdHandlerTests()
    {
        mockRepo = new Mock<ICategoryRepository>();
        handler = new GetCategoryByIdQuery.Handler(mockRepo.Object);
    }

    [Fact]
    public async Task Handle_ReturnsCategoryDto_WhenCategoryExists()
    {
        // Arrange
        var categoryId = Guid.NewGuid();
        var category = new Category { Id = categoryId, Name = "Electronics", Description = "Electronic items" };

        mockRepo
            .Setup(r => r.GetByIdAsync(categoryId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(category);

        var query = new GetCategoryByIdQuery(categoryId);

        // Act
        var result = await handler.Handle(query, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(categoryId, result.Id);
        Assert.Equal("Electronics", result.Name);
        Assert.Equal("Electronic items", result.Description);
    }

    [Fact]
    public async Task Handle_ReturnsNull_WhenCategoryDoesNotExist()
    {
        // Arrange
        var categoryId = Guid.NewGuid();

        mockRepo
            .Setup(r => r.GetByIdAsync(categoryId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Category?)null);

        var query = new GetCategoryByIdQuery(categoryId);

        // Act
        var result = await handler.Handle(query, CancellationToken.None);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task Handle_ShouldCallGetByIdAsyncOnce()
    {
        // Arrange
        var categoryId = Guid.NewGuid();
        var category = new Category { Id = categoryId, Name = "Books" };

        mockRepo
            .Setup(r => r.GetByIdAsync(categoryId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(category);

        var query = new GetCategoryByIdQuery(categoryId);

        // Act
        await handler.Handle(query, CancellationToken.None);

        // Assert
        mockRepo.Verify(r => r.GetByIdAsync(categoryId, It.IsAny<CancellationToken>()), Times.Once);
    }
}
