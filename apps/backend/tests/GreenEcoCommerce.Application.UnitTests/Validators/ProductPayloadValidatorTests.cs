using FluentValidation.TestHelper;
using GreenEcoCommerce.Application.Features.Products;

namespace GreenEcoCommerce.Application.UnitTests.Validators;

public class ProductPayloadValidatorTests
{
    private readonly ProductPayloadDto.Validator validator = new();

    private static ProductPayloadDto ValidPayload(
        string? name = null,
        string? description = null,
        decimal? price = null,
        int? stockQty = null,
        Guid? categoryId = null,
        float? carbonIndex = null,
        float? baselineCarbonIndex = null,
        float? decomposePercent = null,
        float? recyclePercent = null) =>
        new(
            Name: name ?? "Eco Bamboo Toothbrush",
            Description: description ?? "A sustainable toothbrush",
            Price: price ?? 5.99m,
            StockQty: stockQty ?? 100,
            CategoryId: categoryId ?? Guid.NewGuid(),
            CarbonIndex: carbonIndex ?? 0.5f,
            BaselineCarbonIndex: baselineCarbonIndex ?? 2.0f,
            DecomposePercent: decomposePercent ?? 95f,
            RecyclePercent: recyclePercent ?? 80f,
            ImageUrl: ["https://example.com/image.jpg"],
            MaterialIds: [Guid.NewGuid()]
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
    public void Validate_ShouldFail_WhenNameExceeds255Chars()
    {
        var result = validator.TestValidate(ValidPayload(name: new string('A', 256)));
        result.ShouldHaveValidationErrorFor(x => x.Name);
    }

    [Fact]
    public void Validate_ShouldPass_WhenNameIsExactly255Chars()
    {
        var result = validator.TestValidate(ValidPayload(name: new string('A', 255)));
        result.ShouldNotHaveValidationErrorFor(x => x.Name);
    }

    // ── Price ────────────────────────────────────────────────────────────────

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    [InlineData(-100.50)]
    public void Validate_ShouldFail_WhenPriceIsZeroOrNegative(decimal price)
    {
        var result = validator.TestValidate(ValidPayload(price: price));
        result.ShouldHaveValidationErrorFor(x => x.Price);
    }

    [Theory]
    [InlineData(0.01)]
    [InlineData(1)]
    [InlineData(999.99)]
    public void Validate_ShouldPass_WhenPriceIsPositive(decimal price)
    {
        var result = validator.TestValidate(ValidPayload(price: price));
        result.ShouldNotHaveValidationErrorFor(x => x.Price);
    }

    // ── StockQty ─────────────────────────────────────────────────────────────

    [Fact]
    public void Validate_ShouldFail_WhenStockQtyIsNegative()
    {
        var result = validator.TestValidate(ValidPayload(stockQty: -1));
        result.ShouldHaveValidationErrorFor(x => x.StockQty);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(1)]
    [InlineData(500)]
    public void Validate_ShouldPass_WhenStockQtyIsZeroOrPositive(int stockQty)
    {
        var result = validator.TestValidate(ValidPayload(stockQty: stockQty));
        result.ShouldNotHaveValidationErrorFor(x => x.StockQty);
    }

    // ── CategoryId ───────────────────────────────────────────────────────────

    [Fact]
    public void Validate_ShouldFail_WhenCategoryIdIsEmpty()
    {
        var result = validator.TestValidate(ValidPayload(categoryId: Guid.Empty));
        result.ShouldHaveValidationErrorFor(x => x.CategoryId);
    }

    [Fact]
    public void Validate_ShouldPass_WhenCategoryIdIsValidGuid()
    {
        var result = validator.TestValidate(ValidPayload(categoryId: Guid.NewGuid()));
        result.ShouldNotHaveValidationErrorFor(x => x.CategoryId);
    }

    // ── CarbonIndex ──────────────────────────────────────────────────────────

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    public void Validate_ShouldFail_WhenCarbonIndexIsZeroOrNegative(float carbonIndex)
    {
        var result = validator.TestValidate(ValidPayload(carbonIndex: carbonIndex));
        result.ShouldHaveValidationErrorFor(x => x.CarbonIndex);
    }

    [Fact]
    public void Validate_ShouldFail_WhenCarbonIndexExceeds10000()
    {
        var result = validator.TestValidate(ValidPayload(carbonIndex: 10001f));
        result.ShouldHaveValidationErrorFor(x => x.CarbonIndex);
    }

    [Theory]
    [InlineData(0.1f)]
    [InlineData(5000f)]
    [InlineData(9999f)]
    public void Validate_ShouldPass_WhenCarbonIndexIsInRange(float carbonIndex)
    {
        var result = validator.TestValidate(ValidPayload(carbonIndex: carbonIndex));
        result.ShouldNotHaveValidationErrorFor(x => x.CarbonIndex);
    }

    // ── BaselineCarbonIndex ──────────────────────────────────────────────────

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    public void Validate_ShouldFail_WhenBaselineCarbonIndexIsZeroOrNegative(float baseline)
    {
        var result = validator.TestValidate(ValidPayload(baselineCarbonIndex: baseline));
        result.ShouldHaveValidationErrorFor(x => x.BaselineCarbonIndex);
    }

    [Fact]
    public void Validate_ShouldPass_WhenBaselineCarbonIndexIsPositive()
    {
        var result = validator.TestValidate(ValidPayload(baselineCarbonIndex: 7f));
        result.ShouldNotHaveValidationErrorFor(x => x.BaselineCarbonIndex);
    }

    // ── DecomposePercent ─────────────────────────────────────────────────────

    [Theory]
    [InlineData(-1f)]
    [InlineData(-0.1f)]
    public void Validate_ShouldFail_WhenDecomposePercentIsNegative(float percent)
    {
        var result = validator.TestValidate(ValidPayload(decomposePercent: percent));
        result.ShouldHaveValidationErrorFor(x => x.DecomposePercent);
    }

    [Theory]
    [InlineData(100.1f)]
    [InlineData(101f)]
    public void Validate_ShouldFail_WhenDecomposePercentExceeds100(float percent)
    {
        var result = validator.TestValidate(ValidPayload(decomposePercent: percent));
        result.ShouldHaveValidationErrorFor(x => x.DecomposePercent);
    }

    [Theory]
    [InlineData(0f)]
    [InlineData(50f)]
    [InlineData(100f)]
    public void Validate_ShouldPass_WhenDecomposePercentIsInRange(float percent)
    {
        var result = validator.TestValidate(ValidPayload(decomposePercent: percent));
        result.ShouldNotHaveValidationErrorFor(x => x.DecomposePercent);
    }

    // ── RecyclePercent ───────────────────────────────────────────────────────

    [Theory]
    [InlineData(-1f)]
    [InlineData(-0.1f)]
    public void Validate_ShouldFail_WhenRecyclePercentIsNegative(float percent)
    {
        var result = validator.TestValidate(ValidPayload(recyclePercent: percent));
        result.ShouldHaveValidationErrorFor(x => x.RecyclePercent);
    }

    [Theory]
    [InlineData(100.1f)]
    [InlineData(101f)]
    public void Validate_ShouldFail_WhenRecyclePercentExceeds100(float percent)
    {
        var result = validator.TestValidate(ValidPayload(recyclePercent: percent));
        result.ShouldHaveValidationErrorFor(x => x.RecyclePercent);
    }

    [Theory]
    [InlineData(0f)]
    [InlineData(50f)]
    [InlineData(100f)]
    public void Validate_ShouldPass_WhenRecyclePercentIsInRange(float percent)
    {
        var result = validator.TestValidate(ValidPayload(recyclePercent: percent));
        result.ShouldNotHaveValidationErrorFor(x => x.RecyclePercent);
    }
}
