using GreenEcoCommerce.Application.Features.Categories;
using GreenEcoCommerce.Application.Features.Categories.Queries;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Interfaces;
using Moq;

namespace GreenEcoCommerce.Application.UnitTests.Features.Categories;

public class GetAllCategoriesHandlerTests
{
    private readonly Mock<ICategoryRepository> mockRepo;
    private readonly GetAllCategoriesQuery.Handler handler;

    public GetAllCategoriesHandlerTests()
    {
        mockRepo = new Mock<ICategoryRepository>();
        handler = new GetAllCategoriesQuery.Handler(mockRepo.Object);
    }

    [Fact]
    public async Task Handle_ReturnsEmptyList_WhenNoCategoriesExist()
    {
        // Arrange
        var emptyCategories = new List<Category>();

        mockRepo
            .Setup(r => r.GetAllAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(emptyCategories);

        var query = new GetAllCategoriesQuery();

        // Act
        var result = await handler.Handle(query, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Empty(result);
    }

    [Fact]
    public async Task Handle_ReturnsMappedDtos_WhenCategoriesExist()
    {
        // Arrange
        var categories = new List<Category>
        {
            new() { Name = "Electronics" },
            new() { Name = "Clothing" },
            new() { Name = "Books" }
        };

        var categoryDtos = categories
            .Select(c => new CategoryDto(c.Id, c.Name))
            .ToArray();

        mockRepo
            .Setup(r => r.GetAllAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(categories);

        var query = new GetAllCategoriesQuery();

        // Act
        var result = await handler.Handle(query, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(3, result.Length);
        Assert.Equal("Electronics", result[0].Name);
        Assert.Equal("Clothing", result[1].Name);
        Assert.Equal("Books", result[2].Name);
        Assert.Equal(categoryDtos, result);
    }

    [Fact]
    public async Task Handle_ShouldCallGetAllAsyncOnce()
    {
        // Arrange
        mockRepo
            .Setup(r => r.GetAllAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync([]);

        var query = new GetAllCategoriesQuery();

        // Act
        await handler.Handle(query, CancellationToken.None);

        // Assert
        mockRepo.Verify(r => r.GetAllAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}
