using GreenEcoCommerce.Domain.Exceptions;
using GreenEcoCommerce.Domain.ValueObjects;

namespace GreenEcoCommerce.Domain.UnitTests.ValueObjects;

public class PhoneNumberTests
{
    // -----------------------------------------------------------------------
    // Create — happy paths (valid Vietnamese prefixes: 03, 05, 07, 08, 09)
    // -----------------------------------------------------------------------

    [Theory]
    [InlineData("0311111110")]
    [InlineData("0511111110")]
    [InlineData("0711111110")]
    [InlineData("0811111110")]
    [InlineData("0911111110")]
    public void Create_WithValidVietnamesePhone_ShouldSucceed(string validPhone)
    {
        // Act
        var phone = PhoneNumber.From(validPhone);

        // Assert
        Assert.Equal(validPhone, phone.Value);
    }

    // -----------------------------------------------------------------------
    // Create — empty / whitespace guards
    // -----------------------------------------------------------------------

    [Fact]
    public void Create_WithEmpty_ShouldThrowInvalidPhoneNumberException()
    {
        // Act & Assert
        Assert.Throws<InvalidPhoneNumberException>(() => PhoneNumber.From(string.Empty));
    }

    [Fact]
    public void Create_WithWhitespace_ShouldThrowInvalidPhoneNumberException()
    {
        // Act & Assert
        Assert.Throws<InvalidPhoneNumberException>(() => PhoneNumber.From("   "));
    }

    // -----------------------------------------------------------------------
    // Create — invalid prefix (01x, 02x, 04x, 06x)
    // -----------------------------------------------------------------------

    [Theory]
    [InlineData("0111111110")]
    [InlineData("0211111110")]
    [InlineData("0411111110")]
    [InlineData("0611111110")]
    public void Create_WithInvalidPrefix_ShouldThrowInvalidPhoneNumberException(string invalidPhone)
    {
        // Act & Assert
        Assert.Throws<InvalidPhoneNumberException>(() => PhoneNumber.From(invalidPhone));
    }

    // -----------------------------------------------------------------------
    // Create — wrong length
    // -----------------------------------------------------------------------

    [Theory]
    [InlineData("031111111")]   // 9 digits — too short
    [InlineData("03111111100")] // 11 digits — too long
    public void Create_WithWrongLength_ShouldThrowInvalidPhoneNumberException(string wrongLengthPhone)
    {
        // Act & Assert
        Assert.Throws<InvalidPhoneNumberException>(() => PhoneNumber.From(wrongLengthPhone));
    }

    // -----------------------------------------------------------------------
    // Whitespace stripping
    // -----------------------------------------------------------------------

    [Fact]
    public void Create_WithPhoneHavingSpaces_ShouldStripSpacesAndSucceed()
    {
        // Arrange — spaces embedded in the number should be stripped
        const string spacedPhone = "031 1111 110";

        // Act
        var phone = PhoneNumber.From(spacedPhone);

        // Assert
        Assert.Equal("0311111110", phone.Value);
    }

    // -----------------------------------------------------------------------
    // Implicit operator
    // -----------------------------------------------------------------------

    [Fact]
    public void ImplicitOperator_ShouldConvertToString()
    {
        // Arrange
        var phone = PhoneNumber.From("0911111110");

        // Act
        string result = phone; // implicit operator

        // Assert
        Assert.Equal("0911111110", result);
    }

    // -----------------------------------------------------------------------
    // Equality
    // -----------------------------------------------------------------------

    [Fact]
    public void Equals_SamePhoneNumbers_ShouldBeEqual()
    {
        // Arrange
        var phone1 = PhoneNumber.From("0311111110");
        var phone2 = PhoneNumber.From("0311111110");

        // Assert
        Assert.Equal(phone1, phone2);
        Assert.True(phone1.Equals(phone2));
    }

    [Fact]
    public void Equals_DifferentPhoneNumbers_ShouldNotBeEqual()
    {
        // Arrange
        var phone1 = PhoneNumber.From("0311111110");
        var phone2 = PhoneNumber.From("0911111110");

        // Assert
        Assert.NotEqual(phone1, phone2);
        Assert.False(phone1.Equals(phone2));
    }
}
