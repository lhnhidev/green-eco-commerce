using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Enums;
using GreenEcoCommerce.Domain.ValueObjects;

namespace GreenEcoCommerce.Domain.UnitTests.Entities;

public class UserTests
{
    // -----------------------------------------------------------------------
    // Shared test data helpers
    // -----------------------------------------------------------------------

    private static Email ValidEmail => Email.From("alice@green-eco.vn");
    private static PhoneNumber ValidPhone => PhoneNumber.From("0911111110");

    private static User BuildUser(RoleEnum? role = null) =>
        new(
            email: ValidEmail,
            passwordHash: "hashed_password_123",
            firstName: "Alice",
            lastName: "Nguyen",
            phone: ValidPhone,
            address: "123 Green Street, Hanoi",
            role: role);

    // -----------------------------------------------------------------------
    // Constructor — all properties set correctly
    // -----------------------------------------------------------------------

    [Fact]
    public void Constructor_ShouldSetAllPropertiesCorrectly()
    {
        // Arrange
        var email = Email.From("alice@green-eco.vn");
        var phone = PhoneNumber.From("0911111110");
        const string passwordHash = "hashed_password_123";
        const string firstName = "Alice";
        const string lastName = "Nguyen";
        const string address = "123 Green Street, Hanoi";

        // Act
        var user = new User(email, passwordHash, firstName, lastName, phone, address, RoleEnum.User);

        // Assert
        Assert.Equal((string)email, user.Email.Value);
        Assert.Equal(passwordHash, user.PasswordHash);
        Assert.Equal(firstName, user.FirstName);
        Assert.Equal(lastName, user.LastName);
        Assert.Equal((string)phone, user.Phone.Value);
        Assert.Equal(address, user.Address);
        Assert.Equal(RoleEnum.User, user.Role);
    }

    // -----------------------------------------------------------------------
    // Role defaulting
    // -----------------------------------------------------------------------

    [Fact]
    public void Constructor_WithNullRole_ShouldDefaultToUserRole()
    {
        // Act
        var user = BuildUser(role: null);

        // Assert
        Assert.Equal(RoleEnum.User, user.Role);
    }

    [Fact]
    public void Constructor_WithAdminRole_ShouldSetAdminRole()
    {
        // Act
        var user = BuildUser(role: RoleEnum.Admin);

        // Assert
        Assert.Equal(RoleEnum.Admin, user.Role);
    }

    // -----------------------------------------------------------------------
    // FullName composition
    // -----------------------------------------------------------------------

    [Fact]
    public void Constructor_ShouldSetFullNameAsLastNameSpaceFirstName()
    {
        // Arrange
        const string firstName = "Alice";
        const string lastName = "Nguyen";

        // Act
        var user = new User(ValidEmail, "hash", firstName, lastName, ValidPhone, "addr", null);

        // Assert
        Assert.Equal($"{lastName} {firstName}", user.FullName);
    }

    // -----------------------------------------------------------------------
    // Id uniqueness
    // -----------------------------------------------------------------------

    [Fact]
    public void Id_ShouldBeNonEmpty()
    {
        // Act
        var user = BuildUser();

        // Assert
        Assert.NotEqual(Guid.Empty, user.Id);
    }

    [Fact]
    public void Id_ShouldBeUniquePerInstance()
    {
        // Act
        var user1 = BuildUser();
        var user2 = BuildUser();

        // Assert — each call to Guid.CreateVersion7() produces a distinct value
        Assert.NotEqual(user1.Id, user2.Id);
    }
}
