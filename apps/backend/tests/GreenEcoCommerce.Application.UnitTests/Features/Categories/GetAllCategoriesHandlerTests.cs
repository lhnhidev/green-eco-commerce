using AutoMapper;
using GreenEcoCommerce.Application.Features.Categories;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Interfaces;
using Moq;

namespace GreenEcoCommerce.Application.UnitTests.Features.Categories;

public class GetAllCategoriesHandlerTests
{
    private readonly Mock<ICategoryRepository> mockRepo;
    private readonly Mock<IMapper> mockMapper;
    private readonly GetAllCategoriesHandler handler;

    public GetAllCategoriesHandlerTests()
    {
        mockRepo = new Mock<ICategoryRepository>();
        mockMapper = new Mock<IMapper>();
        handler = new GetAllCategoriesHandler(mockRepo.Object, mockMapper.Object);
    }

    [Fact]
    public async Task Handle_ReturnsEmptyList_WhenNoCategoriesExist()
    {
        // Arrange
        var emptyCategories = new List<Category>();
        var emptyDtos = new List<CategoryDto>();

        mockRepo
            .Setup(r => r.GetAllAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(emptyCategories);

        mockMapper
            .Setup(m => m.Map<List<CategoryDto>>(emptyCategories))
            .Returns(emptyDtos);

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
            .ToList();

        mockRepo
            .Setup(r => r.GetAllAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(categories);

        mockMapper
            .Setup(m => m.Map<List<CategoryDto>>(categories))
            .Returns(categoryDtos);

        var query = new GetAllCategoriesQuery();

        // Act
        var result = await handler.Handle(query, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(3, result.Count);
        Assert.Equal("Electronics", result[0].Name);
        Assert.Equal("Clothing", result[1].Name);
        Assert.Equal("Books", result[2].Name);
    }

    [Fact]
    public async Task Handle_ShouldCallGetAllAsyncOnce()
    {
        // Arrange
        mockRepo
            .Setup(r => r.GetAllAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<Category>());

        mockMapper
            .Setup(m => m.Map<List<CategoryDto>>(It.IsAny<List<Category>>()))
            .Returns(new List<CategoryDto>());

        var query = new GetAllCategoriesQuery();

        // Act
        await handler.Handle(query, CancellationToken.None);

        // Assert
        mockRepo.Verify(r => r.GetAllAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_ShouldCallMapperOnce()
    {
        // Arrange
        var categories = new List<Category>
        {
            new() { Name = "Category A" }
        };

        mockRepo
            .Setup(r => r.GetAllAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(categories);

        mockMapper
            .Setup(m => m.Map<List<CategoryDto>>(categories))
            .Returns(new List<CategoryDto> { new(Guid.NewGuid(), "Category A") });

        var query = new GetAllCategoriesQuery();

        // Act
        await handler.Handle(query, CancellationToken.None);

        // Assert
        mockMapper.Verify(m => m.Map<List<CategoryDto>>(categories), Times.Once);
    }
}
