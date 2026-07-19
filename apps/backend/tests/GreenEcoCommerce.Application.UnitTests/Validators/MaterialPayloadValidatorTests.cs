using FluentValidation.TestHelper;
using GreenEcoCommerce.Application.Features.Materials;
using GreenEcoCommerce.Domain.Enums;

namespace GreenEcoCommerce.Application.UnitTests.Validators;

public class MaterialPayloadValidatorTests
{
    private readonly MaterialPayloadDto.Validator validator = new();

    private static MaterialPayloadDto ValidPayload(
        string? name = null,
        MaterialTypeEnum? type = null,
        int? ecoRating = null) =>
        new(
            Name: name ?? "Recycled Bamboo",
            Type: type ?? MaterialTypeEnum.Natural,
            EcoRating: ecoRating ?? 85
        );

    // ── Happy path ───────────────────────────────────────────────────────────

    [Fact]
    public void Validate_ShouldPass_WhenAllDataIsValid()
    {
        var result = validator.TestValidate(ValidPayload());
        result.ShouldNotHaveAnyValidationErrors();
    }

    // ── Name ─────────────────────────────────────────────────────────────────

    [Fact]
    public void Validate_ShouldFail_WhenNameIsEmpty()
    {
        var result = validator.TestValidate(ValidPayload(name: ""));
        result.ShouldHaveValidationErrorFor(x => x.Name);
    }

    [Fact]
    public void Validate_ShouldFail_WhenNameExceeds100Chars()
    {
        var result = validator.TestValidate(ValidPayload(name: new string('A', 101)));
        result.ShouldHaveValidationErrorFor(x => x.Name);
    }

    [Fact]
    public void Validate_ShouldPass_WhenNameIsExactly100Chars()
    {
        var result = validator.TestValidate(ValidPayload(name: new string('A', 100)));
        result.ShouldNotHaveValidationErrorFor(x => x.Name);
    }

    [Theory]
    [InlineData("Wood")]
    [InlineData("Recycled Plastic")]
    public void Validate_ShouldPass_WhenNameIsValidLength(string name)
    {
        var result = validator.TestValidate(ValidPayload(name: name));
        result.ShouldNotHaveValidationErrorFor(x => x.Name);
    }

    // ── Type ─────────────────────────────────────────────────────────────────

    [Fact]
    public void Validate_ShouldFail_WhenTypeIsInvalidEnum()
    {
        var result = validator.TestValidate(ValidPayload(type: (MaterialTypeEnum)999));
        result.ShouldHaveValidationErrorFor(x => x.Type);
    }

    [Fact]
    public void Validate_ShouldPass_WhenTypeIsValidEnum()
    {
        var result = validator.TestValidate(ValidPayload(type: MaterialTypeEnum.Natural));
        result.ShouldNotHaveValidationErrorFor(x => x.Type);
    }

    // ── EcoRating ────────────────────────────────────────────────────────────

    [Fact]
    public void Validate_ShouldFail_WhenEcoRatingIsNegative()
    {
        var result = validator.TestValidate(ValidPayload(ecoRating: -1));
        result.ShouldHaveValidationErrorFor(x => x.EcoRating);
    }

    [Fact]
    public void Validate_ShouldFail_WhenEcoRatingExceeds100()
    {
        var result = validator.TestValidate(ValidPayload(ecoRating: 101));
        result.ShouldHaveValidationErrorFor(x => x.EcoRating);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(50)]
    [InlineData(100)]
    public void Validate_ShouldPass_WhenEcoRatingIsInRange(int ecoRating)
    {
        var result = validator.TestValidate(ValidPayload(ecoRating: ecoRating));
        result.ShouldNotHaveValidationErrorFor(x => x.EcoRating);
    }
}
