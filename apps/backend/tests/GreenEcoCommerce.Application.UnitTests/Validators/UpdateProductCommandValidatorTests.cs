using FluentValidation.TestHelper;
using GreenEcoCommerce.Application.Features.Products;
using GreenEcoCommerce.Application.Features.Products.Commands;

namespace GreenEcoCommerce.Application.UnitTests.Validators;

public class UpdateProductCommandValidatorTests
{
    private readonly UpdateProductCommand.Validator validator = new();

    private static ProductPayloadDto ValidDto() => new(
        Name: "Eco Bamboo Toothbrush",
        Description: "A sustainable toothbrush",
        Price: 5.99m,
        StockQty: 100,
        CategoryId: Guid.NewGuid(),
        CarbonIndex: 0.5f,
        BaselineCarbonIndex: 2.0f,
        DecomposePercent: 95f,
        RecyclePercent: 80f,
        ImageUrl: ["https://example.com/image.jpg"],
        MaterialIds: [Guid.NewGuid()]
    );

    // ── Happy path ───────────────────────────────────────────────────────────

    [Fact]
    public void Validate_ShouldPass_WhenDtoIsValid()
    {
        // Arrange
        var command = new UpdateProductCommand(Guid.NewGuid(), ValidDto());

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
        var command = new UpdateProductCommand(Guid.NewGuid(), dto);

        // Act
        var result = validator.TestValidate(command);

        // Assert
        result.ShouldHaveValidationErrorFor("Dto.Name");
    }

    [Fact]
    public void Validate_ShouldFail_WhenDtoPriceIsZero()
    {
        // Arrange
        var dto = ValidDto() with { Price = 0 };
        var command = new UpdateProductCommand(Guid.NewGuid(), dto);

        // Act
        var result = validator.TestValidate(command);

        // Assert
        result.ShouldHaveValidationErrorFor("Dto.Price");
    }

    [Fact]
    public void Validate_ShouldFail_WhenDtoCategoryIdIsEmpty()
    {
        // Arrange
        var dto = ValidDto() with { CategoryId = Guid.Empty };
        var command = new UpdateProductCommand(Guid.NewGuid(), dto);

        // Act
        var result = validator.TestValidate(command);

        // Assert
        result.ShouldHaveValidationErrorFor("Dto.CategoryId");
    }
}
