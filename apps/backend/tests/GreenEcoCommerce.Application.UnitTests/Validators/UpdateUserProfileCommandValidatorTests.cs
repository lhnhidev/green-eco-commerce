using FluentValidation.TestHelper;
using GreenEcoCommerce.Application.Features.Profile;

namespace GreenEcoCommerce.Application.UnitTests.Validators;

public class UpdateUserProfileCommandValidatorTests
{
    private readonly UserProfilePayloadDto.Validator validator = new();

    private static UserProfilePayloadDto ValidCommand(
        string? firstName = null,
        string? lastName = null,
        string? phone = null,
        string? address = null) =>
        new(
            Avatar: "https://example.com/avatar.png",
            FirstName: firstName ?? "Nguyen",
            LastName: lastName ?? "Van A",
            Password: "SecureP@ss1",
            Phone: phone ?? "0811125678",
            Address: address ?? "123 Le Loi Street, District 1, HCMC"
        );

    // ── Happy path ───────────────────────────────────────────────────────────

    [Fact]
    public void Validate_ShouldPass_WhenAllFieldsAreValid()
    {
        var result = validator.TestValidate(ValidCommand());
        result.ShouldNotHaveAnyValidationErrors();
    }

    // ── FirstName ────────────────────────────────────────────────────────────

    [Fact]
    public void Validate_ShouldFail_WhenFirstNameIsEmpty()
    {
        var result = validator.TestValidate(ValidCommand(firstName: ""));
        result.ShouldHaveValidationErrorFor(x => x.FirstName);
    }

    [Theory]
    [InlineData("A")]  // 1 char — below min of 2
    public void Validate_ShouldFail_WhenFirstNameIsTooShort(string firstName)
    {
        var result = validator.TestValidate(ValidCommand(firstName: firstName));
        result.ShouldHaveValidationErrorFor(x => x.FirstName);
    }

    [Fact]
    public void Validate_ShouldFail_WhenFirstNameExceeds80Chars()
    {
        var result = validator.TestValidate(ValidCommand(firstName: new string('A', 81)));
        result.ShouldHaveValidationErrorFor(x => x.FirstName);
    }

    [Theory]
    [InlineData("Jo")]           // exactly 2 — min boundary
    [InlineData("Nguyen")]
    [InlineData("Christopher")]
    public void Validate_ShouldPass_WhenFirstNameIsValidLength(string firstName)
    {
        var result = validator.TestValidate(ValidCommand(firstName: firstName));
        result.ShouldNotHaveValidationErrorFor(x => x.FirstName);
    }

    [Fact]
    public void Validate_ShouldPass_WhenFirstNameIsExactly80Chars()
    {
        var result = validator.TestValidate(ValidCommand(firstName: new string('A', 80)));
        result.ShouldNotHaveValidationErrorFor(x => x.FirstName);
    }

    // ── LastName ─────────────────────────────────────────────────────────────

    [Fact]
    public void Validate_ShouldFail_WhenLastNameIsEmpty()
    {
        var result = validator.TestValidate(ValidCommand(lastName: ""));
        result.ShouldHaveValidationErrorFor(x => x.LastName);
    }

    [Theory]
    [InlineData("B")]  // 1 char — below min of 2
    public void Validate_ShouldFail_WhenLastNameIsTooShort(string lastName)
    {
        var result = validator.TestValidate(ValidCommand(lastName: lastName));
        result.ShouldHaveValidationErrorFor(x => x.LastName);
    }

    [Fact]
    public void Validate_ShouldFail_WhenLastNameExceeds80Chars()
    {
        var result = validator.TestValidate(ValidCommand(lastName: new string('B', 81)));
        result.ShouldHaveValidationErrorFor(x => x.LastName);
    }

    [Theory]
    [InlineData("Do")]           // exactly 2 — min boundary
    [InlineData("Van A")]
    [InlineData("Rodriguez")]
    public void Validate_ShouldPass_WhenLastNameIsValidLength(string lastName)
    {
        var result = validator.TestValidate(ValidCommand(lastName: lastName));
        result.ShouldNotHaveValidationErrorFor(x => x.LastName);
    }

    // ── Phone ────────────────────────────────────────────────────────────────

    [Fact]
    public void Validate_ShouldFail_WhenPhoneIsEmpty()
    {
        var result = validator.TestValidate(ValidCommand(phone: ""));
        result.ShouldHaveValidationErrorFor(x => x.Phone);
    }

    [Theory]
    [InlineData("031111111")]   // 9 digits — too short
    [InlineData("03111111100")] // 11 digits — too long
    public void Validate_ShouldFail_WhenPhoneHasWrongLength(string phone)
    {
        var result = validator.TestValidate(ValidCommand(phone: phone));
        result.ShouldHaveValidationErrorFor(x => x.Phone);
    }

    [Theory]
    [InlineData("0111111110")] // invalid prefix 01
    [InlineData("0211111110")] // invalid prefix 02
    [InlineData("0411111110")] // invalid prefix 04
    [InlineData("0611111110")] // invalid prefix 06
    public void Validate_ShouldFail_WhenPhoneHasInvalidPrefix(string phone)
    {
        var result = validator.TestValidate(ValidCommand(phone: phone));
        result.ShouldHaveValidationErrorFor(x => x.Phone);
    }

    [Theory]
    [InlineData("0311111110")]
    [InlineData("0511111110")]
    [InlineData("0711111110")]
    [InlineData("0811111110")]
    [InlineData("0911111110")]
    public void Validate_ShouldPass_WhenPhoneIsValid(string phone)
    {
        var result = validator.TestValidate(ValidCommand(phone: phone));
        result.ShouldNotHaveValidationErrorFor(x => x.Phone);
    }

    // ── Address ──────────────────────────────────────────────────────────────

    [Fact]
    public void Validate_ShouldFail_WhenAddressIsEmpty()
    {
        var result = validator.TestValidate(ValidCommand(address: ""));
        result.ShouldHaveValidationErrorFor(x => x.Address);
    }

    [Theory]
    [InlineData("abc")]   // 3 chars — below min of 5
    [InlineData("1234")]  // 4 chars — still below min
    public void Validate_ShouldFail_WhenAddressIsTooShort(string address)
    {
        var result = validator.TestValidate(ValidCommand(address: address));
        result.ShouldHaveValidationErrorFor(x => x.Address);
    }

    [Fact]
    public void Validate_ShouldFail_WhenAddressExceeds500Chars()
    {
        var result = validator.TestValidate(ValidCommand(address: new string('A', 501)));
        result.ShouldHaveValidationErrorFor(x => x.Address);
    }

    [Theory]
    [InlineData("12 St")]                                  // exactly 5 chars — min boundary
    [InlineData("123 Le Loi Street, District 1, HCMC")]
    public void Validate_ShouldPass_WhenAddressIsValidLength(string address)
    {
        var result = validator.TestValidate(ValidCommand(address: address));
        result.ShouldNotHaveValidationErrorFor(x => x.Address);
    }

    [Fact]
    public void Validate_ShouldPass_WhenAddressIsExactly500Chars()
    {
        var result = validator.TestValidate(ValidCommand(address: new string('A', 500)));
        result.ShouldNotHaveValidationErrorFor(x => x.Address);
    }
}
