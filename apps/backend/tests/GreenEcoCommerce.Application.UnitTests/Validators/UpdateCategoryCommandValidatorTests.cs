using FluentValidation.TestHelper;
using GreenEcoCommerce.Application.Features.Categories;
using GreenEcoCommerce.Application.Features.Categories.Validators;

namespace GreenEcoCommerce.Application.UnitTests.Validators;

public class UpdateCategoryCommandValidatorTests
{
    private readonly UpdateCategoryCommandValidator validator;

    public UpdateCategoryCommandValidatorTests()
    {
        validator = new UpdateCategoryCommandValidator();
    }

    private static UpdateCategoryCommand CreateValidCommand(
        Guid? id = null,
        string name = "Valid Name",
        string? description = null,
        Guid? parentId = null)
    {
        var dto = new CategoryPayloadDto(name, description, parentId);
        return new UpdateCategoryCommand(id ?? Guid.NewGuid(), dto);
    }

    // ── Id ───────────────────────────────────────────────────────────────────

    [Fact]
    public void Validate_ShouldPass_WhenCommandIsFullyValid()
    {
        // Arrange
        var command = CreateValidCommand();

        // Act
        var result = validator.TestValidate(command);

        // Assert
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Validate_ShouldFail_WhenIdIsEmptyGuid()
    {
        // Arrange
        var command = CreateValidCommand(id: Guid.Empty);

        // Act
        var result = validator.TestValidate(command);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Id);
    }

    [Fact]
    public void Validate_ShouldPass_WhenIdIsValidGuid()
    {
        // Arrange
        var command = CreateValidCommand(id: Guid.NewGuid());

        // Act
        var result = validator.TestValidate(command);

        // Assert
        result.ShouldNotHaveValidationErrorFor(x => x.Id);
    }

    // ── Name ─────────────────────────────────────────────────────────────────

    [Fact]
    public void Validate_ShouldFail_WhenNameIsEmpty()
    {
        // Arrange
        var command = CreateValidCommand(name: "");

        // Act
        var result = validator.TestValidate(command);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Dto.Name);
    }

    [Theory]
    [InlineData("A")]
    public void Validate_ShouldFail_WhenNameIsTooShort(string name)
    {
        // Arrange
        var command = CreateValidCommand(name: name);

        // Act
        var result = validator.TestValidate(command);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Dto.Name);
    }

    [Fact]
    public void Validate_ShouldFail_WhenNameIsTooLong()
    {
        // Arrange
        var name = new string('A', 101);
        var command = CreateValidCommand(name: name);

        // Act
        var result = validator.TestValidate(command);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Dto.Name);
    }

    [Theory]
    [InlineData("Ab")]
    [InlineData("Valid Category")]
    public void Validate_ShouldPass_WhenNameIsValidLength(string name)
    {
        // Arrange
        var command = CreateValidCommand(name: name);

        // Act
        var result = validator.TestValidate(command);

        // Assert
        result.ShouldNotHaveValidationErrorFor(x => x.Dto.Name);
    }

    [Fact]
    public void Validate_ShouldPass_WhenNameIsExactly100Chars()
    {
        // Arrange
        var command = CreateValidCommand(name: new string('N', 100));

        // Act
        var result = validator.TestValidate(command);

        // Assert
        result.ShouldNotHaveValidationErrorFor(x => x.Dto.Name);
    }

    // ── Description ──────────────────────────────────────────────────────────

    [Fact]
    public void Validate_ShouldFail_WhenDescriptionExceeds500Chars()
    {
        // Arrange
        var command = CreateValidCommand(description: new string('D', 501));

        // Act
        var result = validator.TestValidate(command);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Dto.Description);
    }

    [Fact]
    public void Validate_ShouldPass_WhenDescriptionIsNull()
    {
        // Arrange
        var command = CreateValidCommand(description: null);

        // Act
        var result = validator.TestValidate(command);

        // Assert
        result.ShouldNotHaveValidationErrorFor(x => x.Dto.Description);
    }

    [Fact]
    public void Validate_ShouldPass_WhenDescriptionIsEmpty()
    {
        // Arrange
        var command = CreateValidCommand(description: string.Empty);

        // Act
        var result = validator.TestValidate(command);

        // Assert
        result.ShouldNotHaveValidationErrorFor(x => x.Dto.Description);
    }

    [Fact]
    public void Validate_ShouldPass_WhenDescriptionIsExactly500Chars()
    {
        // Arrange
        var command = CreateValidCommand(description: new string('D', 500));

        // Act
        var result = validator.TestValidate(command);

        // Assert
        result.ShouldNotHaveValidationErrorFor(x => x.Dto.Description);
    }

    // ── ParentId ─────────────────────────────────────────────────────────────

    [Fact]
    public void Validate_ShouldPass_WhenParentIdIsNull()
    {
        // Arrange
        var command = CreateValidCommand(parentId: null);

        // Act
        var result = validator.TestValidate(command);

        // Assert
        result.ShouldNotHaveValidationErrorFor(x => x.Dto.ParentId);
    }

    [Fact]
    public void Validate_ShouldPass_WhenParentIdIsValidGuid()
    {
        // Arrange
        var command = CreateValidCommand(parentId: Guid.NewGuid());

        // Act
        var result = validator.TestValidate(command);

        // Assert
        result.ShouldNotHaveValidationErrorFor(x => x.Dto.ParentId);
    }
}
