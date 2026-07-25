using FluentValidation.TestHelper;
using GreenEcoCommerce.Application.Features.Reviews;

namespace GreenEcoCommerce.Application.UnitTests.Validators;

public class CreateReviewValidatorTests
{
    private readonly CreateReviewPayloadDto.Validator validator = new();

    // ── Rating ──────────────────────────────────────────────────────────────

    [Fact]
    public void Validate_ShouldPass_WhenAllDataIsValid()
    {
        // Arrange
        var dto = new CreateReviewPayloadDto(5, "A valid comment");

        // Act
        var result = validator.TestValidate(dto);

        // Assert
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Validate_ShouldFail_WhenRatingIsZero()
    {
        // Arrange
        var dto = new CreateReviewPayloadDto(0);

        // Act
        var result = validator.TestValidate(dto);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Rating);
    }

    [Fact]
    public void Validate_ShouldFail_WhenRatingIsSix()
    {
        // Arrange
        var dto = new CreateReviewPayloadDto(6);

        // Act
        var result = validator.TestValidate(dto);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Rating);
    }

    [Theory]
    [InlineData(1)] // exactly 1 - min boundary
    [InlineData(5)] // exactly 5 - max boundary
    public void Validate_ShouldPass_WhenRatingIsWithinRange(int rating)
    {
        // Arrange
        var dto = new CreateReviewPayloadDto(rating);

        // Act
        var result = validator.TestValidate(dto);

        // Assert
        result.ShouldNotHaveValidationErrorFor(x => x.Rating);
    }

    // ── Comment ─────────────────────────────────────────────────────────────

    [Fact]
    public void Validate_ShouldFail_WhenCommentExceeds500Chars()
    {
        // Arrange
        string comment = new('C', 501); // 501 chars > 500 max
        var dto = new CreateReviewPayloadDto(5, comment);

        // Act
        var result = validator.TestValidate(dto);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Comment);
    }

    [Fact]
    public void Validate_ShouldPass_WhenCommentIsExactly500Chars()
    {
        // Arrange
        string comment = new('C', 500);
        var dto = new CreateReviewPayloadDto(5, comment);

        // Act
        var result = validator.TestValidate(dto);

        // Assert
        result.ShouldNotHaveValidationErrorFor(x => x.Comment);
    }

    [Fact]
    public void Validate_ShouldPass_WhenCommentIsNull()
    {
        // Arrange
        // Note: The validator uses .When(x => x.Comment != null)
        // so a null comment bypasses the MaxLength rule entirely
        var dto = new CreateReviewPayloadDto(5);

        // Act
        var result = validator.TestValidate(dto);

        // Assert
        result.ShouldNotHaveValidationErrorFor(x => x.Comment);
    }
}