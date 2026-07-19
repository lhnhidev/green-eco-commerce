using FluentValidation.TestHelper;
using GreenEcoCommerce.Application.Features.Materials;
using GreenEcoCommerce.Application.Features.Materials.Commands;
using GreenEcoCommerce.Domain.Enums;

namespace GreenEcoCommerce.Application.UnitTests.Validators;

public class UpdateMaterialCommandValidatorTests
{
    private readonly UpdateMaterialCommand.Validator validator = new();

    private static MaterialPayloadDto ValidDto() => new(
        Name: "Recycled Bamboo",
        Type: MaterialTypeEnum.Recycled,
        EcoRating: 85
    );

    // ── Happy path ───────────────────────────────────────────────────────────

    [Fact]
    public void Validate_ShouldPass_WhenDtoIsValid()
    {
        // Arrange
        var command = new UpdateMaterialCommand(Guid.NewGuid(), ValidDto());

        // Act
        var result = validator.TestValidate(command);

        // Assert
        result.ShouldNotHaveAnyValidationErrors();
    }

    // ── Delegated validation ─────────────────────────────────────────────────

    [Fact]
    public void Validate_ShouldFail_WhenDtoNameIsEmpty()
    {
        // Arrange
        var dto = ValidDto() with { Name = "" };
        var command = new UpdateMaterialCommand(Guid.NewGuid(), dto);

        // Act
        var result = validator.TestValidate(command);

        // Assert
        result.ShouldHaveValidationErrorFor("Dto.Name");
    }

    [Fact]
    public void Validate_ShouldFail_WhenDtoTypeIsInvalid()
    {
        // Arrange
        var dto = ValidDto() with { Type = (MaterialTypeEnum)999 };
        var command = new UpdateMaterialCommand(Guid.NewGuid(), dto);

        // Act
        var result = validator.TestValidate(command);

        // Assert
        result.ShouldHaveValidationErrorFor("Dto.Type");
    }

    [Fact]
    public void Validate_ShouldFail_WhenDtoEcoRatingExceeds100()
    {
        // Arrange
        var dto = ValidDto() with { EcoRating = 101 };
        var command = new UpdateMaterialCommand(Guid.NewGuid(), dto);

        // Act
        var result = validator.TestValidate(command);

        // Assert
        result.ShouldHaveValidationErrorFor("Dto.EcoRating");
    }
}
