using FluentValidation.TestHelper;
using GreenEcoCommerce.Application.Features.Auth.Register;

namespace GreenEcoCommerce.Application.UnitTests.Validators;

public class RegisterCommandValidatorTests
{
    private readonly RegisterCommandValidator validator = new();

    // Creates a fully valid RegisterCommand; individual fields can be overridden.
    private static RegisterCommand CreateValidCommand(string firstName = "John", string lastName = "Doe",
                                                      string phone = "0311111110", string address = "123 Main Street",
                                                      string? role = null, string email = "john@example.com",
                                                      string password = "Password1") =>
            new(firstName, lastName, phone, address, role, email, password);

    // ── Happy path ───────────────────────────────────────────────────────────

    [Fact]
    public void Validate_ShouldPass_WhenAllFieldsAreValid()
    {
        var result = validator.TestValidate(CreateValidCommand());
        result.ShouldNotHaveAnyValidationErrors();
    }

    // ── FirstName ────────────────────────────────────────────────────────────

    [Fact]
    public void Validate_ShouldFail_WhenFirstNameIsEmpty()
    {
        var result = validator.TestValidate(CreateValidCommand(firstName: ""));
        result.ShouldHaveValidationErrorFor(x => x.FirstName);
    }

    [Theory]
    [InlineData("A")]
    public void Validate_ShouldFail_WhenFirstNameIsTooShort(string firstName)
    {
        var result = validator.TestValidate(CreateValidCommand(firstName: firstName));
        result.ShouldHaveValidationErrorFor(x => x.FirstName);
    }

    [Fact]
    public void Validate_ShouldFail_WhenFirstNameIsTooLong()
    {
        var result = validator.TestValidate(CreateValidCommand(firstName: new string('A', 81)));
        result.ShouldHaveValidationErrorFor(x => x.FirstName);
    }

    [Theory]
    [InlineData("Jo")]              // 2 chars – boundary
    [InlineData("John")]
    [InlineData("Christopher")]
    public void Validate_ShouldPass_WhenFirstNameIsValidLength(string firstName)
    {
        var result = validator.TestValidate(CreateValidCommand(firstName: firstName));
        result.ShouldNotHaveValidationErrorFor(x => x.FirstName);
    }

    // ── LastName ─────────────────────────────────────────────────────────────

    [Fact]
    public void Validate_ShouldFail_WhenLastNameIsEmpty()
    {
        var result = validator.TestValidate(CreateValidCommand(lastName: ""));
        result.ShouldHaveValidationErrorFor(x => x.LastName);
    }

    [Theory]
    [InlineData("B")]
    public void Validate_ShouldFail_WhenLastNameIsTooShort(string lastName)
    {
        var result = validator.TestValidate(CreateValidCommand(lastName: lastName));
        result.ShouldHaveValidationErrorFor(x => x.LastName);
    }

    [Fact]
    public void Validate_ShouldFail_WhenLastNameIsTooLong()
    {
        var result = validator.TestValidate(CreateValidCommand(lastName: new string('B', 81)));
        result.ShouldHaveValidationErrorFor(x => x.LastName);
    }

    [Theory]
    [InlineData("Do")]
    [InlineData("Doe")]
    [InlineData("Rodriguez")]
    public void Validate_ShouldPass_WhenLastNameIsValidLength(string lastName)
    {
        var result = validator.TestValidate(CreateValidCommand(lastName: lastName));
        result.ShouldNotHaveValidationErrorFor(x => x.LastName);
    }

    // ── Phone ─────────────────────────────────────────────────────────────────

    [Fact]
    public void Validate_ShouldFail_WhenPhoneIsEmpty()
    {
        var result = validator.TestValidate(CreateValidCommand(phone: ""));
        result.ShouldHaveValidationErrorFor(x => x.Phone);
    }

    [Theory]
    [InlineData("031111111")]   // 9 digits – too short
    [InlineData("03111111100")] // 11 digits – too long
    public void Validate_ShouldFail_WhenPhoneHasWrongLength(string phone)
    {
        var result = validator.TestValidate(CreateValidCommand(phone: phone));
        result.ShouldHaveValidationErrorFor(x => x.Phone);
    }

    [Theory]
    [InlineData("0111111110")] // starts with 01 – invalid prefix
    [InlineData("0211111110")] // starts with 02 – invalid prefix
    [InlineData("0411111110")] // starts with 04 – invalid prefix
    [InlineData("0611111110")] // starts with 06 – invalid prefix
    public void Validate_ShouldFail_WhenPhoneHasInvalidPrefix(string phone)
    {
        var result = validator.TestValidate(CreateValidCommand(phone: phone));
        result.ShouldHaveValidationErrorFor(x => x.Phone);
    }

    [Theory]
    [InlineData("031111111A")] // contains non-digit letter
    public void Validate_ShouldFail_WhenPhoneHasInvalidPattern(string phone)
    {
        var result = validator.TestValidate(CreateValidCommand(phone: phone));
        result.ShouldHaveValidationErrorFor(x => x.Phone);
    }

    [Theory]
    [InlineData("0311111110")] // starts with 03
    [InlineData("0511111110")] // starts with 05
    [InlineData("0711111110")] // starts with 07
    [InlineData("0811111110")] // starts with 08
    [InlineData("0911111110")] // starts with 09
    public void Validate_ShouldPass_WhenPhoneIsValid(string phone)
    {
        var result = validator.TestValidate(CreateValidCommand(phone: phone));
        result.ShouldNotHaveValidationErrorFor(x => x.Phone);
    }

    // ── Address ───────────────────────────────────────────────────────────────

    [Fact]
    public void Validate_ShouldFail_WhenAddressIsEmpty()
    {
        var result = validator.TestValidate(CreateValidCommand(address: ""));
        result.ShouldHaveValidationErrorFor(x => x.Address);
    }

    [Theory]
    [InlineData("1 St")] // 4 chars – too short
    public void Validate_ShouldFail_WhenAddressIsTooShort(string address)
    {
        var result = validator.TestValidate(CreateValidCommand(address: address));
        result.ShouldHaveValidationErrorFor(x => x.Address);
    }

    [Fact]
    public void Validate_ShouldFail_WhenAddressIsTooLong()
    {
        var result = validator.TestValidate(CreateValidCommand(address: new string('A', 501)));
        result.ShouldHaveValidationErrorFor(x => x.Address);
    }

    [Theory]
    [InlineData("12 St")]           // exactly 5 chars
    [InlineData("123 Main Street")]
    public void Validate_ShouldPass_WhenAddressIsValidLength(string address)
    {
        var result = validator.TestValidate(CreateValidCommand(address: address));
        result.ShouldNotHaveValidationErrorFor(x => x.Address);
    }

    // ── Email ─────────────────────────────────────────────────────────────────

    [Fact]
    public void Validate_ShouldFail_WhenEmailIsEmpty()
    {
        var result = validator.TestValidate(CreateValidCommand(email: ""));
        result.ShouldHaveValidationErrorFor(x => x.Email);
    }

    [Theory]
    [InlineData("notanemail")]
    [InlineData("@nodomain.com")]
    [InlineData("missing@domain")]
    [InlineData("spaces in@email.com")]
    public void Validate_ShouldFail_WhenEmailIsInvalidFormat(string email)
    {
        var result = validator.TestValidate(CreateValidCommand(email: email));
        result.ShouldHaveValidationErrorFor(x => x.Email);
    }

    [Theory]
    [InlineData("valid@example.com")]
    [InlineData("user.name+tag@sub.domain.org")]
    public void Validate_ShouldPass_WhenEmailIsValid(string email)
    {
        var result = validator.TestValidate(CreateValidCommand(email: email));
        result.ShouldNotHaveValidationErrorFor(x => x.Email);
    }

    // ── Password ──────────────────────────────────────────────────────────────

    [Fact]
    public void Validate_ShouldFail_WhenPasswordIsEmpty()
    {
        var result = validator.TestValidate(CreateValidCommand(password: ""));
        result.ShouldHaveValidationErrorFor(x => x.Password);
    }

    [Theory]
    [InlineData("Ab1")]   // 3 chars
    [InlineData("Ab1de")] // 5 chars
    public void Validate_ShouldFail_WhenPasswordIsTooShort(string password)
    {
        var result = validator.TestValidate(CreateValidCommand(password: password));
        result.ShouldHaveValidationErrorFor(x => x.Password);
    }

    [Fact]
    public void Validate_ShouldFail_WhenPasswordHasNoUppercase()
    {
        var result = validator.TestValidate(CreateValidCommand(password: "password1"));
        result.ShouldHaveValidationErrorFor(x => x.Password);
    }

    [Fact]
    public void Validate_ShouldFail_WhenPasswordHasNoLowercase()
    {
        var result = validator.TestValidate(CreateValidCommand(password: "PASSWORD1"));
        result.ShouldHaveValidationErrorFor(x => x.Password);
    }

    [Fact]
    public void Validate_ShouldFail_WhenPasswordHasNoDigit()
    {
        var result = validator.TestValidate(CreateValidCommand(password: "PasswordOnly"));
        result.ShouldHaveValidationErrorFor(x => x.Password);
    }

    [Theory]
    [InlineData("Password1")]
    [InlineData("S3cur3P@ss")]
    [InlineData("MyPass123")]
    public void Validate_ShouldPass_WhenPasswordMeetsAllRules(string password)
    {
        var result = validator.TestValidate(CreateValidCommand(password: password));
        result.ShouldNotHaveValidationErrorFor(x => x.Password);
    }
}
