using GreenEcoCommerce.Domain.Exceptions;
using GreenEcoCommerce.Domain.ValueObjects;

namespace GreenEcoCommerce.Domain.UnitTests.ValueObjects;

public class EmailTests
{
    // -----------------------------------------------------------------------
    // Create — happy paths
    // -----------------------------------------------------------------------

    [Theory]
    [InlineData("test@email.com")]
    [InlineData("user@domain.org")]
    [InlineData("admin@green-eco.vn")]
    public void Create_WithValidEmail_ShouldSucceed(string validEmail)
    {
        // Act
        var email = Email.From(validEmail);

        // Assert
        Assert.Equal(validEmail.Trim(), email.Value);
    }

    // -----------------------------------------------------------------------
    // Create — empty / whitespace / null guards
    // -----------------------------------------------------------------------

    [Fact]
    public void Create_WithEmpty_ShouldThrowInvalidEmailException()
    {
        // Act & Assert
        Assert.Throws<InvalidEmailException>(() => Email.From(string.Empty));
    }

    [Fact]
    public void Create_WithWhitespaceOnly_ShouldThrowInvalidEmailException()
    {
        // Act & Assert
        Assert.Throws<InvalidEmailException>(() => Email.From("   "));
    }

    [Fact]
    public void Create_WithNull_ShouldThrowInvalidEmailException()
    {
        // Act & Assert
        Assert.Throws<InvalidEmailException>(() => Email.From(null!));
    }

    // -----------------------------------------------------------------------
    // Create — invalid format
    // -----------------------------------------------------------------------

    [Theory]
    [InlineData("notanemail")]
    [InlineData("@nodomain")]
    [InlineData("noatsign.com")]
    [InlineData("spaces @here.com")]
    public void Create_WithInvalidFormat_ShouldThrowInvalidEmailException(string invalidEmail)
    {
        // Act & Assert
        Assert.Throws<InvalidEmailException>(() => Email.From(invalidEmail));
    }

    // -----------------------------------------------------------------------
    // Trimming
    // -----------------------------------------------------------------------

    [Fact]
    public void Create_ShouldTrimWhitespace()
    {
        // Arrange
        const string paddedEmail = "  test@email.com  ";

        // Act
        var email = Email.From(paddedEmail);

        // Assert
        Assert.Equal("test@email.com", email.Value);
    }

    // -----------------------------------------------------------------------
    // Implicit operator
    // -----------------------------------------------------------------------

    [Fact]
    public void ImplicitOperator_ShouldConvertToString()
    {
        // Arrange
        var email = Email.From("test@email.com");

        // Act
        string result = email; // implicit operator

        // Assert
        Assert.Equal("test@email.com", result);
    }

    // -----------------------------------------------------------------------
    // Equality
    // -----------------------------------------------------------------------

    [Fact]
    public void Equals_SameCaseEmails_ShouldBeEqual()
    {
        // Arrange
        var email1 = Email.From("test@email.com");
        var email2 = Email.From("test@email.com");

        // Assert
        Assert.Equal(email1, email2);
        Assert.True(email1.Equals(email2));
    }

    [Fact]
    public void Equals_DifferentCaseEmails_ShouldBeEqual()
    {
        // Arrange
        var email1 = Email.From("Test@Email.COM");
        var email2 = Email.From("test@email.com");

        // Assert — comparison must be case-insensitive
        Assert.True(email1.Equals(email2));
    }

    [Fact]
    public void Equals_DifferentEmails_ShouldNotBeEqual()
    {
        // Arrange
        var email1 = Email.From("alice@email.com");
        var email2 = Email.From("bob@email.com");

        // Assert
        Assert.NotEqual(email1, email2);
        Assert.False(email1.Equals(email2));
    }

    // -----------------------------------------------------------------------
    // GetHashCode
    // -----------------------------------------------------------------------

    [Fact]
    public void GetHashCode_SameEmailDifferentCase_ShouldBeEqual()
    {
        // Arrange
        var email1 = Email.From("Test@Email.COM");
        var email2 = Email.From("test@email.com");

        // Assert — hash codes must be equal for case-insensitive equal values
        Assert.Equal(email1.GetHashCode(), email2.GetHashCode());
    }

    // -----------------------------------------------------------------------
    // ToString
    // -----------------------------------------------------------------------

    [Fact]
    public void ToString_ShouldReturnValue()
    {
        // Arrange
        const string raw = "test@email.com";
        var email = Email.From(raw);

        // Assert
        Assert.Equal(raw, email.ToString());
    }
}
