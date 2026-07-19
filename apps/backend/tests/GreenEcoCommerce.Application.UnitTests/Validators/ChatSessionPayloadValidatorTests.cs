using FluentValidation.TestHelper;
using GreenEcoCommerce.Application.Features.ChatSessions;

namespace GreenEcoCommerce.Application.UnitTests.Validators;

public class ChatSessionPayloadValidatorTests
{
    private readonly ChatSessionPayloadDto.Validator validator = new();

    // ── Happy path ───────────────────────────────────────────────────────────

    [Theory]
    [InlineData("My Chat Session")]
    [InlineData("AB")]               // exactly 2 chars — minimum boundary
    [InlineData("Green Living Q&A")]
    public void Validate_ShouldPass_WhenTitleIsValid(string title)
    {
        // Arrange
        var dto = new ChatSessionPayloadDto(title);

        // Act
        var result = validator.TestValidate(dto);

        // Assert
        result.ShouldNotHaveAnyValidationErrors();
    }

    // ── Title — empty ────────────────────────────────────────────────────────

    [Fact]
    public void Validate_ShouldFail_WhenTitleIsEmpty()
    {
        // Arrange
        var dto = new ChatSessionPayloadDto("");

        // Act
        var result = validator.TestValidate(dto);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Title);
    }

    // ── Title — too short ────────────────────────────────────────────────────

    [Theory]
    [InlineData("A")]    // 1 char — below min of 2
    public void Validate_ShouldFail_WhenTitleIsTooShort(string title)
    {
        // Arrange
        var dto = new ChatSessionPayloadDto(title);

        // Act
        var result = validator.TestValidate(dto);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Title);
    }

    // ── Title — boundary at min (2) ──────────────────────────────────────────

    [Fact]
    public void Validate_ShouldPass_WhenTitleIsExactly2Chars()
    {
        // Arrange
        var dto = new ChatSessionPayloadDto("AB");

        // Act
        var result = validator.TestValidate(dto);

        // Assert
        result.ShouldNotHaveValidationErrorFor(x => x.Title);
    }

    // ── Title — too long ─────────────────────────────────────────────────────

    [Fact]
    public void Validate_ShouldFail_WhenTitleExceeds255Chars()
    {
        // Arrange
        var dto = new ChatSessionPayloadDto(new string('T', 256));

        // Act
        var result = validator.TestValidate(dto);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Title);
    }

    // ── Title — boundary at max (255) ────────────────────────────────────────

    [Fact]
    public void Validate_ShouldPass_WhenTitleIsExactly255Chars()
    {
        // Arrange
        var dto = new ChatSessionPayloadDto(new string('T', 255));

        // Act
        var result = validator.TestValidate(dto);

        // Assert
        result.ShouldNotHaveValidationErrorFor(x => x.Title);
    }

    // ── Error messages ───────────────────────────────────────────────────────

    [Fact]
    public void Validate_ShouldContainCorrectMessage_WhenTitleIsEmpty()
    {
        // Arrange
        var dto = new ChatSessionPayloadDto("");

        // Act
        var result = validator.TestValidate(dto);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Title)
              .WithErrorMessage("Chat session title is required.");
    }
}
