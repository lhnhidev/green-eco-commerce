using FluentValidation.TestHelper;
using GreenEcoCommerce.Application.Features.Categories;
using GreenEcoCommerce.Application.Features.Categories.Commands;
using GreenEcoCommerce.Application.Features.Categories.Validators;

namespace GreenEcoCommerce.Application.UnitTests.Validators;

public class DeleteCategoryCommandValidatorTests
{
    private readonly DeleteCategoryCommandValidator validator;

    public DeleteCategoryCommandValidatorTests()
    {
        validator = new DeleteCategoryCommandValidator();
    }

    [Fact]
    public void Validate_ShouldPass_WhenIdIsValidGuid()
    {
        // Arrange
        var command = new DeleteCategoryCommand(Guid.NewGuid());

        // Act
        var result = validator.TestValidate(command);

        // Assert
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Validate_ShouldFail_WhenIdIsEmptyGuid()
    {
        // Arrange
        var command = new DeleteCategoryCommand(Guid.Empty);

        // Act
        var result = validator.TestValidate(command);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Id);
    }

    [Fact]
    public void Validate_ShouldFail_WhenIdIsDefault()
    {
        // Arrange
        var command = new DeleteCategoryCommand(default);

        // Act
        var result = validator.TestValidate(command);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Id);
    }

    [Fact]
    public void Validate_ShouldContainErrorMessage_WhenIdIsEmptyGuid()
    {
        // Arrange
        var command = new DeleteCategoryCommand(Guid.Empty);

        // Act
        var result = validator.TestValidate(command);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Id)
              .WithErrorMessage("Category ID must be a valid GUID.");
    }

    [Theory]
    [InlineData("d3e1f2a0-1234-5678-abcd-ef0123456789")]
    [InlineData("a1b2c3d4-e5f6-7890-abcd-ef0123456789")]
    public void Validate_ShouldPass_WhenIdIsNonEmptyGuid(string guidString)
    {
        // Arrange
        var command = new DeleteCategoryCommand(Guid.Parse(guidString));

        // Act
        var result = validator.TestValidate(command);

        // Assert
        result.ShouldNotHaveValidationErrorFor(x => x.Id);
    }
}
