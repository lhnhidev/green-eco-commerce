using GreenEcoCommerce.Domain.ValueObjects;
using Vogen;

namespace GreenEcoCommerce.Domain.UnitTests.ValueObjects;

public class PasswordTests
{
    // -----------------------------------------------------------------------
    // Create — happy paths
    // -----------------------------------------------------------------------

    [Theory]
    [InlineData("Abcde1")]         // exactly 6 chars — minimum length boundary
    [InlineData("StrongP@ss123")]  // strong password with special char
    [InlineData("Password1")]      // simple valid password
    [InlineData("aB3defghij")]     // longer valid password
    public void Create_WithValidPassword_ShouldSucceed(string validPassword)
    {
        // Act
        var password = Password.From(validPassword);

        // Assert
        Assert.Equal(validPassword, password.Value);
    }

    // -----------------------------------------------------------------------
    // Create — empty / whitespace / null guards
    // -----------------------------------------------------------------------

    [Fact]
    public void Create_WithEmpty_ShouldThrowValueObjectValidationException()
    {
        // Act & Assert
        Assert.Throws<ValueObjectValidationException>(() => Password.From(string.Empty));
    }

    [Fact]
    public void Create_WithWhitespace_ShouldThrowValueObjectValidationException()
    {
        // Act & Assert
        Assert.Throws<ValueObjectValidationException>(() => Password.From("   "));
    }

    [Fact]
    public void Create_WithNull_ShouldThrowValueObjectValidationException()
    {
        // Act & Assert
        Assert.Throws<ValueObjectValidationException>(() => Password.From(null!));
    }

    // -----------------------------------------------------------------------
    // Create — regex validation failures
    // -----------------------------------------------------------------------

    [Theory]
    [InlineData("abcde1")]   // no uppercase letter
    [InlineData("ABCDE1")]   // no lowercase letter
    [InlineData("Abcdef")]   // no digit
    [InlineData("Ab1")]      // too short (3 chars < 6 minimum)
    [InlineData("Ab12")]     // too short (4 chars)
    [InlineData("Ab1cd")]    // too short (5 chars)
    public void Create_WithInvalidFormat_ShouldThrowValueObjectValidationException(string invalidPassword)
    {
        // Act & Assert
        Assert.Throws<ValueObjectValidationException>(() => Password.From(invalidPassword));
    }

    // -----------------------------------------------------------------------
    // Boundary — exactly minimum length (6)
    // -----------------------------------------------------------------------

    [Fact]
    public void Create_ExactlyMinLength_ShouldSucceed()
    {
        // Arrange — 6 chars with uppercase, lowercase, and digit
        const string password = "Abcde1";

        // Act
        var result = Password.From(password);

        // Assert
        Assert.Equal(password, result.Value);
    }

    // -----------------------------------------------------------------------
    // ToString — masking (prevents accidental password logging)
    // -----------------------------------------------------------------------

    [Fact]
    public void ToString_ShouldReturnMaskedValue()
    {
        // Arrange
        var password = Password.From("SecureP@ss1");

        // Act
        string result = password.ToString();

        // Assert — Password.ToString() always returns "********"
        Assert.Equal("********", result);
    }

    // -----------------------------------------------------------------------
    // Equality
    // -----------------------------------------------------------------------

    [Fact]
    public void Equals_SamePasswords_ShouldBeEqual()
    {
        // Arrange
        var pw1 = Password.From("Abcde1");
        var pw2 = Password.From("Abcde1");

        // Assert
        Assert.Equal(pw1, pw2);
        Assert.True(pw1.Equals(pw2));
    }

    [Fact]
    public void Equals_DifferentPasswords_ShouldNotBeEqual()
    {
        // Arrange
        var pw1 = Password.From("Abcde1");
        var pw2 = Password.From("Fghij2");

        // Assert
        Assert.NotEqual(pw1, pw2);
        Assert.False(pw1.Equals(pw2));
    }

    // -----------------------------------------------------------------------
    // GetHashCode
    // -----------------------------------------------------------------------

    [Fact]
    public void GetHashCode_SamePasswords_ShouldBeEqual()
    {
        // Arrange
        var pw1 = Password.From("Abcde1");
        var pw2 = Password.From("Abcde1");

        // Assert
        Assert.Equal(pw1.GetHashCode(), pw2.GetHashCode());
    }
}
