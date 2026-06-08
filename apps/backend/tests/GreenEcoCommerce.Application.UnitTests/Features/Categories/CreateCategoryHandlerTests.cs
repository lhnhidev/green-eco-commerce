using AutoMapper;
using GreenEcoCommerce.Application.Features.Categories;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Interfaces;
using Moq;

namespace GreenEcoCommerce.Application.UnitTests.Features.Categories;

public class CreateCategoryHandlerTests
{
    private readonly Mock<ICategoryRepository> mockRepo;
    private readonly Mock<IMapper> mockMapper;
    private readonly CreateCategoryHandler handler;

    public CreateCategoryHandlerTests()
    {
        mockRepo = new Mock<ICategoryRepository>();
        mockMapper = new Mock<IMapper>();
        handler = new CreateCategoryHandler(mockRepo.Object, mockMapper.Object);
    }

    [Fact]
    public async Task Handle_ShouldAddCategoryAndReturnDto()
    {
        // Arrange
        var command = new CategoryPayloadDto("Electronics", "Electronic goods", null);
        var categoryEntity = new Category { Name = "Electronics", Description = "Electronic goods" };
        var savedCategory = new Category { Id = Guid.NewGuid(), Name = "Electronics", Description = "Electronic goods" };
        var expectedDto = new CategoryDto(savedCategory.Id, savedCategory.Name, savedCategory.Description);

        mockMapper
            .Setup(m => m.Map<Category>(command))
            .Returns(categoryEntity);

        mockRepo
            .Setup(r => r.AddAsync(categoryEntity, It.IsAny<CancellationToken>()))
            .ReturnsAsync(savedCategory);

        mockMapper
            .Setup(m => m.Map<CategoryDto>(savedCategory))
            .Returns(expectedDto);

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
        var categoryEntity = new Category { Name = "Clothing" };
        var savedCategory = new Category { Id = Guid.NewGuid(), Name = "Clothing" };

        mockMapper
            .Setup(m => m.Map<Category>(command))
            .Returns(categoryEntity);

        mockRepo
            .Setup(r => r.AddAsync(categoryEntity, It.IsAny<CancellationToken>()))
            .ReturnsAsync(savedCategory);

        mockMapper
            .Setup(m => m.Map<CategoryDto>(savedCategory))
            .Returns(new CategoryDto(savedCategory.Id, "Clothing"));

        // Act
        await handler.Handle(command, CancellationToken.None);

        // Assert
        mockRepo.Verify(r => r.AddAsync(categoryEntity, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_ShouldCallMapperTwice_OnceForEntityOnceForDto()
    {
        // Arrange
        var command = new CategoryPayloadDto("Books", "All kinds of books");
        var categoryEntity = new Category { Name = "Books", Description = "All kinds of books" };
        var savedCategory = new Category { Id = Guid.NewGuid(), Name = "Books", Description = "All kinds of books" };
        var expectedDto = new CategoryDto(savedCategory.Id, "Books", "All kinds of books");

        mockMapper
            .Setup(m => m.Map<Category>(command))
            .Returns(categoryEntity);

        mockRepo
            .Setup(r => r.AddAsync(categoryEntity, It.IsAny<CancellationToken>()))
            .ReturnsAsync(savedCategory);

        mockMapper
            .Setup(m => m.Map<CategoryDto>(savedCategory))
            .Returns(expectedDto);

        // Act
        await handler.Handle(command, CancellationToken.None);

        // Assert - mapper called once for Category entity, once for CategoryDto
        mockMapper.Verify(m => m.Map<Category>(command), Times.Once);
        mockMapper.Verify(m => m.Map<CategoryDto>(savedCategory), Times.Once);
    }

    [Fact]
    public async Task Handle_ShouldCreateCategoryWithParentId_WhenParentIdProvided()
    {
        // Arrange
        var parentId = Guid.NewGuid();
        var command = new CategoryPayloadDto("Sub-Electronics", null, parentId);
        var categoryEntity = new Category { Name = "Sub-Electronics", ParentId = parentId };
        var savedCategory = new Category { Id = Guid.NewGuid(), Name = "Sub-Electronics", ParentId = parentId };
        var expectedDto = new CategoryDto(savedCategory.Id, "Sub-Electronics", null, parentId);

        mockMapper
            .Setup(m => m.Map<Category>(command))
            .Returns(categoryEntity);

        mockRepo
            .Setup(r => r.AddAsync(categoryEntity, It.IsAny<CancellationToken>()))
            .ReturnsAsync(savedCategory);

        mockMapper
            .Setup(m => m.Map<CategoryDto>(savedCategory))
            .Returns(expectedDto);

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.Equal(parentId, result.ParentId);
    }
}
