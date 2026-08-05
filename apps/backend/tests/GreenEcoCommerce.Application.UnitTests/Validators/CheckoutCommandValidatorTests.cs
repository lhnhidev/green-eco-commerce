using FluentValidation.TestHelper;
using GreenEcoCommerce.Application.Features.Checkout.Commands;
using GreenEcoCommerce.Domain.Enums;

namespace GreenEcoCommerce.Application.UnitTests.Validators;

public class CheckoutCommandValidatorTests
{
    private readonly CheckoutCommand.Validator validator = new();

    private static CheckoutCommand ValidCommand(
        Guid? userId = null,
        int? pointsToRedeem = null,
        string? deliveryAddress = null,
        PaymentMethodEnum? paymentMethod = null) =>
        new(
            UserId: userId ?? Guid.NewGuid(),
            PointsToRedeem: pointsToRedeem ?? 0,
            DeliveryAddress: deliveryAddress ?? "123 Le Loi Street, District 1, HCMC",
            PaymentMethod: paymentMethod ?? PaymentMethodEnum.COD
        );

    // ── Happy path ───────────────────────────────────────────────────────────

    [Fact]
    public void Validate_ShouldPass_WhenAllFieldsAreValid()
    {
        var result = validator.TestValidate(ValidCommand());
        result.ShouldNotHaveAnyValidationErrors();
    }

    // ── DeliveryAddress ──────────────────────────────────────────────────────

    [Fact]
    public void Validate_ShouldFail_WhenDeliveryAddressIsEmpty()
    {
        var result = validator.TestValidate(ValidCommand(deliveryAddress: ""));
        result.ShouldHaveValidationErrorFor(x => x.DeliveryAddress);
    }

    [Fact]
    public void Validate_ShouldFail_WhenDeliveryAddressExceeds500Chars()
    {
        var result = validator.TestValidate(ValidCommand(deliveryAddress: new string('A', 501)));
        result.ShouldHaveValidationErrorFor(x => x.DeliveryAddress);
    }

    [Fact]
    public void Validate_ShouldPass_WhenDeliveryAddressIsExactly500Chars()
    {
        var result = validator.TestValidate(ValidCommand(deliveryAddress: new string('A', 500)));
        result.ShouldNotHaveValidationErrorFor(x => x.DeliveryAddress);
    }

    [Theory]
    [InlineData("123 Main Street")]
    [InlineData("456 Green Avenue, Ho Chi Minh City")]
    public void Validate_ShouldPass_WhenDeliveryAddressIsValid(string address)
    {
        var result = validator.TestValidate(ValidCommand(deliveryAddress: address));
        result.ShouldNotHaveValidationErrorFor(x => x.DeliveryAddress);
    }

    // ── PointsToRedeem ───────────────────────────────────────────────────────

    [Fact]
    public void Validate_ShouldFail_WhenPointsToRedeemIsNegative()
    {
        var result = validator.TestValidate(ValidCommand(pointsToRedeem: -1));
        result.ShouldHaveValidationErrorFor(x => x.PointsToRedeem);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(1)]
    [InlineData(100)]
    [InlineData(5000)]
    public void Validate_ShouldPass_WhenPointsToRedeemIsZeroOrPositive(int points)
    {
        var result = validator.TestValidate(ValidCommand(pointsToRedeem: points));
        result.ShouldNotHaveValidationErrorFor(x => x.PointsToRedeem);
    }

    // ── PaymentMethod ────────────────────────────────────────────────────────

    [Fact]
    public void Validate_ShouldFail_WhenPaymentMethodIsInvalid()
    {
        var result = validator.TestValidate(ValidCommand(paymentMethod: (PaymentMethodEnum)999));
        result.ShouldHaveValidationErrorFor(x => x.PaymentMethod);
    }

    [Fact]
    public void Validate_ShouldPass_WhenPaymentMethodIsCOD()
    {
        var result = validator.TestValidate(ValidCommand(paymentMethod: PaymentMethodEnum.COD));
        result.ShouldNotHaveValidationErrorFor(x => x.PaymentMethod);
    }
}
