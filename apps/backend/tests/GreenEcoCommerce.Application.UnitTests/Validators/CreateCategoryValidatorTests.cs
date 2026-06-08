using FluentValidation.TestHelper;
using GreenEcoCommerce.Application.Features.Categories;
using GreenEcoCommerce.Application.Features.Categories.Validators;

namespace GreenEcoCommerce.Application.UnitTests.Validators;

public class CreateCategoryValidatorTests
{
    private readonly CreateCategoryValidator validator = new();

    // ── Name ────────────────────────────────────────────────────────────────

    [Fact]
    public void Validate_ShouldPass_WhenAllDataIsValid()
    {
        // Arrange
        var dto = new CategoryPayloadDto("Electronics", "A valid description", null);

        // Act
        var result = validator.TestValidate(dto);

        // Assert
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Validate_ShouldFail_WhenNameIsEmpty()
    {
        // Arrange
        var dto = new CategoryPayloadDto("", "Description");

        // Act
        var result = validator.TestValidate(dto);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Name);
    }

    [Theory]
    [InlineData("A")]
    public void Validate_ShouldFail_WhenNameIsTooShort(string name)
    {
        // Arrange
        var dto = new CategoryPayloadDto(name);

        // Act
        var result = validator.TestValidate(dto);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Name);
    }

    [Fact]
    public void Validate_ShouldFail_WhenNameIsTooLong()
    {
        // Arrange
        var name = new string('A', 101); // 101 chars > 100 max
        var dto = new CategoryPayloadDto(name);

        // Act
        var result = validator.TestValidate(dto);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Name);
    }

    [Theory]
    [InlineData("Ab")]          // exactly 2 - min boundary
    [InlineData("ValidName")]   // normal name
    [InlineData("ValidNameXX")] // well within range
    public void Validate_ShouldPass_WhenNameIsValidLength(string name)
    {
        // Arrange
        var dto = new CategoryPayloadDto(name);

        // Act
        var result = validator.TestValidate(dto);

        // Assert
        result.ShouldNotHaveValidationErrorFor(x => x.Name);
    }

    [Fact]
    public void Validate_ShouldPass_WhenNameIsExactly100Chars()
    {
        // Arrange
        var name = new string('A', 100);
        var dto = new CategoryPayloadDto(name);

        // Act
        var result = validator.TestValidate(dto);

        // Assert
        result.ShouldNotHaveValidationErrorFor(x => x.Name);
    }

    // ── Description ─────────────────────────────────────────────────────────

    [Fact]
    public void Validate_ShouldFail_WhenDescriptionExceeds500Chars()
    {
        // Arrange
        var description = new string('D', 501); // 501 chars > 500 max
        var dto = new CategoryPayloadDto("ValidName", description);

        // Act
        var result = validator.TestValidate(dto);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Description);
    }

    [Fact]
    public void Validate_ShouldPass_WhenDescriptionIsNull()
    {
        // Arrange
        var dto = new CategoryPayloadDto("ValidName", null);

        // Act
        var result = validator.TestValidate(dto);

        // Assert
        result.ShouldNotHaveValidationErrorFor(x => x.Description);
    }

    [Fact]
    public void Validate_ShouldPass_WhenDescriptionIsEmpty()
    {
        // Arrange
        // Note: The validator uses .When(x => !string.IsNullOrEmpty(x.Description))
        // so empty string bypasses the MaxLength rule
        var dto = new CategoryPayloadDto("ValidName", string.Empty);

        // Act
        var result = validator.TestValidate(dto);

        // Assert
        result.ShouldNotHaveValidationErrorFor(x => x.Description);
    }

    [Fact]
    public void Validate_ShouldPass_WhenDescriptionIsExactly500Chars()
    {
        // Arrange
        var description = new string('D', 500);
        var dto = new CategoryPayloadDto("ValidName", description);

        // Act
        var result = validator.TestValidate(dto);

        // Assert
        result.ShouldNotHaveValidationErrorFor(x => x.Description);
    }

    // ── ParentId ─────────────────────────────────────────────────────────────

    [Fact]
    public void Validate_ShouldPass_WhenParentIdIsNull()
    {
        // Arrange
        var dto = new CategoryPayloadDto("ValidName", null, null);

        // Act
        var result = validator.TestValidate(dto);

        // Assert
        result.ShouldNotHaveValidationErrorFor(x => x.ParentId);
    }

    [Fact]
    public void Validate_ShouldPass_WhenParentIdIsValidGuid()
    {
        // Arrange
        var dto = new CategoryPayloadDto("ValidName", null, Guid.NewGuid());

        // Act
        var result = validator.TestValidate(dto);

        // Assert
        result.ShouldNotHaveValidationErrorFor(x => x.ParentId);
    }
}
