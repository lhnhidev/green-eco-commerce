using AutoMapper;
using GreenEcoCommerce.Application.Features.Categories;
using GreenEcoCommerce.Application.Features.Categories.Queries;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Exceptions;
using GreenEcoCommerce.Domain.Interfaces;
using Moq;

namespace GreenEcoCommerce.Application.UnitTests.Features.Categories;

public class GetCategoryByIdHandlerTests
{
    private readonly Mock<ICategoryRepository> mockRepo;
    private readonly Mock<IMapper> mockMapper;
    private readonly GetCategoryById handler;

    public GetCategoryByIdHandlerTests()
    {
        mockRepo = new Mock<ICategoryRepository>();
        mockMapper = new Mock<IMapper>();
        handler = new GetCategoryById(mockRepo.Object, mockMapper.Object);
    }

    [Fact]
    public async Task Handle_ReturnsCategoryDto_WhenCategoryExists()
    {
        // Arrange
        var categoryId = Guid.NewGuid();
        var category = new Category { Id = categoryId, Name = "Electronics", Description = "Electronic items" };
        var expectedDto = new CategoryDto(categoryId, "Electronics", "Electronic items");

        mockRepo
            .Setup(r => r.GetByIdAsync(categoryId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(category);

        mockMapper
            .Setup(m => m.Map<CategoryDto>(category))
            .Returns(expectedDto);

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
    public async Task Handle_ThrowsNotFoundException_WhenCategoryDoesNotExist()
    {
        // Arrange
        var categoryId = Guid.NewGuid();

        mockRepo
            .Setup(r => r.GetByIdAsync(categoryId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Category?)null);

        var query = new GetCategoryByIdQuery(categoryId);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<NotFoundException>(
            () => handler.Handle(query, CancellationToken.None));

        Assert.Equal("Not found category", exception.Message);
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

        mockMapper
            .Setup(m => m.Map<CategoryDto>(category))
            .Returns(new CategoryDto(categoryId, "Books"));

        var query = new GetCategoryByIdQuery(categoryId);

        // Act
        await handler.Handle(query, CancellationToken.None);

        // Assert
        mockRepo.Verify(r => r.GetByIdAsync(categoryId, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_ShouldNotCallMapper_WhenCategoryDoesNotExist()
    {
        // Arrange
        var categoryId = Guid.NewGuid();

        mockRepo
            .Setup(r => r.GetByIdAsync(categoryId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Category?)null);

        var query = new GetCategoryByIdQuery(categoryId);

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(
            () => handler.Handle(query, CancellationToken.None));

        mockMapper.Verify(m => m.Map<CategoryDto>(It.IsAny<Category>()), Times.Never);
    }
}
