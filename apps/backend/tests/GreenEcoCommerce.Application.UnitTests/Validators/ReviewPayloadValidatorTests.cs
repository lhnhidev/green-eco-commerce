using FluentValidation.TestHelper;
using GreenEcoCommerce.Application.Features.Reviews;

namespace GreenEcoCommerce.Application.UnitTests.Validators;

public class ReviewPayloadValidatorTests
{
    private readonly ReviewPayloadDto.Validator _validator = new();

    [Fact]
    public void Validate_ShouldPass_WhenAllDataIsValid()
    {
        var result = _validator.TestValidate(new ReviewPayloadDto(4, "Sturdy and plastic-free."));

        result.ShouldNotHaveAnyValidationErrors();
    }

    [Theory]
    [InlineData(1)]
    [InlineData(3)]
    [InlineData(5)]
    public void Validate_ShouldPass_WhenRatingIsWithinRange(int rating)
    {
        var result = _validator.TestValidate(new ReviewPayloadDto(rating, "Fine."));

        result.ShouldNotHaveValidationErrorFor(x => x.Rating);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(6)]
    [InlineData(-1)]
    public void Validate_ShouldFail_WhenRatingIsOutOfRange(int rating)
    {
        var result = _validator.TestValidate(new ReviewPayloadDto(rating, "Fine."));

        result.ShouldHaveValidationErrorFor(x => x.Rating);
    }

    [Fact]
    public void Validate_ShouldFail_WhenCommentIsEmpty()
    {
        var result = _validator.TestValidate(new ReviewPayloadDto(4, ""));

        result.ShouldHaveValidationErrorFor(x => x.Comment);
    }

    [Fact]
    public void Validate_ShouldPass_WhenCommentIsExactly1000Chars()
    {
        var result = _validator.TestValidate(new ReviewPayloadDto(4, new string('a', 1000)));

        result.ShouldNotHaveValidationErrorFor(x => x.Comment);
    }

    [Fact]
    public void Validate_ShouldFail_WhenCommentExceeds1000Chars()
    {
        var result = _validator.TestValidate(new ReviewPayloadDto(4, new string('a', 1001)));

        result.ShouldHaveValidationErrorFor(x => x.Comment);
    }
}