using FluentValidation.TestHelper;
using GreenEcoCommerce.Application.Features.Carts;

namespace GreenEcoCommerce.Application.UnitTests.Validators;

public class CartItemPayloadValidatorTests
{
    private readonly CartItemPayloadDto.Validator validator = new();

    // ── Happy path ───────────────────────────────────────────────────────────

    [Theory]
    [InlineData(1)]
    [InlineData(50)]
    [InlineData(100)]
    public void Validate_ShouldPass_WhenQuantityIsValid(int quantity)
    {
        // Arrange
        var dto = new CartItemPayloadDto(Guid.NewGuid(), quantity);

        // Act
        var result = validator.TestValidate(dto);

        // Assert
        result.ShouldNotHaveValidationErrorFor(x => x.Quantity);
    }

    // ── Quantity — lower boundary ────────────────────────────────────────────

    [Fact]
    public void Validate_ShouldFail_WhenQuantityIsZero()
    {
        // Arrange
        var dto = new CartItemPayloadDto(Guid.NewGuid(), 0);

        // Act
        var result = validator.TestValidate(dto);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Quantity);
    }

    [Fact]
    public void Validate_ShouldFail_WhenQuantityIsNegative()
    {
        // Arrange
        var dto = new CartItemPayloadDto(Guid.NewGuid(), -1);

        // Act
        var result = validator.TestValidate(dto);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Quantity);
    }

    // ── Quantity — upper boundary ────────────────────────────────────────────

    [Fact]
    public void Validate_ShouldFail_WhenQuantityExceeds100()
    {
        // Arrange
        var dto = new CartItemPayloadDto(Guid.NewGuid(), 101);

        // Act
        var result = validator.TestValidate(dto);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Quantity);
    }

    // ── Boundary values ──────────────────────────────────────────────────────

    [Fact]
    public void Validate_ShouldPass_WhenQuantityIsExactlyOne()
    {
        // Arrange — lower boundary
        var dto = new CartItemPayloadDto(Guid.NewGuid(), 1);

        // Act
        var result = validator.TestValidate(dto);

        // Assert
        result.ShouldNotHaveValidationErrorFor(x => x.Quantity);
    }

    [Fact]
    public void Validate_ShouldPass_WhenQuantityIsExactly100()
    {
        // Arrange — upper boundary
        var dto = new CartItemPayloadDto(Guid.NewGuid(), 100);

        // Act
        var result = validator.TestValidate(dto);

        // Assert
        result.ShouldNotHaveValidationErrorFor(x => x.Quantity);
    }

    // ── Default quantity ─────────────────────────────────────────────────────

    [Fact]
    public void Validate_ShouldPass_WhenUsingDefaultQuantity()
    {
        // Arrange — default Quantity is 1
        var dto = new CartItemPayloadDto(Guid.NewGuid());

        // Act
        var result = validator.TestValidate(dto);

        // Assert
        result.ShouldNotHaveAnyValidationErrors();
    }
}
