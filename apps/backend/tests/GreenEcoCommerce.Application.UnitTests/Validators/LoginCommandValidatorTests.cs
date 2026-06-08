using FluentValidation.TestHelper;
using GreenEcoCommerce.Application.Features.Auth.Login;
using GreenEcoCommerce.Application.Features.Auth.Validators;

namespace GreenEcoCommerce.Application.UnitTests.Validators;

public class LoginCommandValidatorTests
{
    private readonly LoginCommandValidator validator;

    public LoginCommandValidatorTests()
    {
        validator = new LoginCommandValidator();
    }

    // ── Happy path ───────────────────────────────────────────────────────────

    [Fact]
    public void Validate_ShouldPass_WhenAllFieldsAreValid()
    {
        // Arrange
        var command = new LoginCommand("user@example.com", "Password1");

        // Act
        var result = validator.TestValidate(command);

        // Assert
        result.ShouldNotHaveAnyValidationErrors();
    }

    // ── Email ─────────────────────────────────────────────────────────────────

    [Fact]
    public void Validate_ShouldFail_WhenEmailIsEmpty()
    {
        // Arrange
        var command = new LoginCommand("", "Password1");

        // Act
        var result = validator.TestValidate(command);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Email);
    }

    [Theory]
    [InlineData("notanemail")]
    [InlineData("missingat.com")]
    [InlineData("@nodomain.com")]
    [InlineData("user@")]
    public void Validate_ShouldFail_WhenEmailIsInvalidFormat(string email)
    {
        // Arrange
        var command = new LoginCommand(email, "Password1");

        // Act
        var result = validator.TestValidate(command);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Email);
    }

    [Theory]
    [InlineData("valid@example.com")]
    [InlineData("admin@greeneco.vn")]
    [InlineData("user.name@sub.domain.io")]
    public void Validate_ShouldPass_WhenEmailIsValid(string email)
    {
        // Arrange
        var command = new LoginCommand(email, "Password1");

        // Act
        var result = validator.TestValidate(command);

        // Assert
        result.ShouldNotHaveValidationErrorFor(x => x.Email);
    }

    // ── Password ──────────────────────────────────────────────────────────────

    [Fact]
    public void Validate_ShouldFail_WhenPasswordIsEmpty()
    {
        // Arrange
        var command = new LoginCommand("user@example.com", "");

        // Act
        var result = validator.TestValidate(command);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Password);
    }

    [Theory]
    [InlineData("anypass")]
    [InlineData("123456")]
    [InlineData("short")]
    public void Validate_ShouldPass_WhenPasswordIsNotEmpty(string password)
    {
        // Arrange
        // LoginCommandValidator only checks NotEmpty for Password - no length/complexity here
        var command = new LoginCommand("user@example.com", password);

        // Act
        var result = validator.TestValidate(command);

        // Assert
        result.ShouldNotHaveValidationErrorFor(x => x.Password);
    }

    // ── Combined ─────────────────────────────────────────────────────────────

    [Fact]
    public void Validate_ShouldFail_WhenBothEmailAndPasswordAreEmpty()
    {
        // Arrange
        var command = new LoginCommand("", "");

        // Act
        var result = validator.TestValidate(command);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Email);
        result.ShouldHaveValidationErrorFor(x => x.Password);
    }

    [Fact]
    public void Validate_ShouldContainCorrectErrorMessage_WhenEmailIsEmpty()
    {
        // Arrange
        var command = new LoginCommand("", "Password1");

        // Act
        var result = validator.TestValidate(command);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Email)
              .WithErrorMessage("Email is required.");
    }

    [Fact]
    public void Validate_ShouldContainCorrectErrorMessage_WhenPasswordIsEmpty()
    {
        // Arrange
        var command = new LoginCommand("user@example.com", "");

        // Act
        var result = validator.TestValidate(command);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Password)
              .WithErrorMessage("Password is required.");
    }
}
