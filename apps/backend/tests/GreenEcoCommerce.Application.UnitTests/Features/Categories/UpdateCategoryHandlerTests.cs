using AutoMapper;
using GreenEcoCommerce.Application.Features.Categories;
using GreenEcoCommerce.Application.Features.Categories.Commands;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Exceptions;
using GreenEcoCommerce.Domain.Interfaces;
using Moq;

namespace GreenEcoCommerce.Application.UnitTests.Features.Categories;

public class UpdateCategoryHandlerTests
{
    private readonly Mock<ICategoryRepository> mockRepo;
    private readonly Mock<IMapper> mockMapper;
    private readonly UpdateCategoryHandler handler;

    public UpdateCategoryHandlerTests()
    {
        mockRepo = new Mock<ICategoryRepository>();
        mockMapper = new Mock<IMapper>();
        handler = new UpdateCategoryHandler(mockRepo.Object, mockMapper.Object);
    }

    [Fact]
    public async Task Handle_ShouldReturnUpdatedDto_WhenCategoryExists()
    {
        // Arrange
        var categoryId = Guid.NewGuid();
        var dto = new CategoryPayloadDto("Updated Electronics", "Updated description");
        var command = new UpdateCategoryCommand(categoryId, dto);
        var categoryEntity = new Category { Id = categoryId, Name = "Updated Electronics", Description = "Updated description" };
        var expectedDto = new CategoryDto(categoryId, "Updated Electronics", "Updated description");

        mockMapper
            .Setup(m => m.Map<Category>(command))
            .Returns(categoryEntity);

        mockRepo
            .Setup(r => r.UpdateAsync(categoryEntity, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        mockMapper
            .Setup(m => m.Map<CategoryDto>(command))
            .Returns(expectedDto);

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(categoryId, result.Id);
        Assert.Equal("Updated Electronics", result.Name);
    }

    [Fact]
    public async Task Handle_ThrowsNotFoundException_WhenCategoryNotFound()
    {
        // Arrange
        var categoryId = Guid.NewGuid();
        var dto = new CategoryPayloadDto("Non-Existent");
        var command = new UpdateCategoryCommand(categoryId, dto);
        var categoryEntity = new Category { Id = categoryId, Name = "Non-Existent" };

        mockMapper
            .Setup(m => m.Map<Category>(command))
            .Returns(categoryEntity);

        mockRepo
            .Setup(r => r.UpdateAsync(categoryEntity, It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<NotFoundException>(
            () => handler.Handle(command, CancellationToken.None));

        Assert.Contains(categoryId.ToString(), exception.Message);
        Assert.Contains("not found", exception.Message, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task Handle_ShouldCallUpdateAsyncOnce()
    {
        // Arrange
        var categoryId = Guid.NewGuid();
        var dto = new CategoryPayloadDto("Clothing");
        var command = new UpdateCategoryCommand(categoryId, dto);
        var categoryEntity = new Category { Id = categoryId, Name = "Clothing" };
        var expectedDto = new CategoryDto(categoryId, "Clothing");

        mockMapper
            .Setup(m => m.Map<Category>(command))
            .Returns(categoryEntity);

        mockRepo
            .Setup(r => r.UpdateAsync(categoryEntity, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        mockMapper
            .Setup(m => m.Map<CategoryDto>(command))
            .Returns(expectedDto);

        // Act
        await handler.Handle(command, CancellationToken.None);

        // Assert
        mockRepo.Verify(r => r.UpdateAsync(categoryEntity, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_ShouldNotThrow_WhenCategoryUpdatedSuccessfully()
    {
        // Arrange
        var categoryId = Guid.NewGuid();
        var dto = new CategoryPayloadDto("Valid Name", "Valid desc");
        var command = new UpdateCategoryCommand(categoryId, dto);
        var categoryEntity = new Category { Id = categoryId, Name = "Valid Name" };
        var expectedDto = new CategoryDto(categoryId, "Valid Name", "Valid desc");

        mockMapper.Setup(m => m.Map<Category>(command)).Returns(categoryEntity);
        mockRepo.Setup(r => r.UpdateAsync(categoryEntity, It.IsAny<CancellationToken>())).ReturnsAsync(true);
        mockMapper.Setup(m => m.Map<CategoryDto>(command)).Returns(expectedDto);

        // Act
        var exception = await Record.ExceptionAsync(() => handler.Handle(command, CancellationToken.None));

        // Assert
        Assert.Null(exception);
    }
}
