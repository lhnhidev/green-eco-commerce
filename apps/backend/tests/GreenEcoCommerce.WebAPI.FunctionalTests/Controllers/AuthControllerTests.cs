using System.Net;
using System.Net.Http.Json;
using GreenEcoCommerce.Application.Features.Auth.Register;
using GreenEcoCommerce.WebAPI.FunctionalTests.Shared;

namespace GreenEcoCommerce.WebAPI.FunctionalTests.Controllers;

/// <summary>
/// Functional tests for <c>POST /api/auth/register</c>, <c>POST /api/auth/login</c>,
/// and <c>POST /api/auth/logout</c> via a real ASP.NET Core test host with a
/// Testcontainers database.
/// </summary>
public sealed class AuthControllerTests(CustomWebApplicationFactory factory)
        : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient client = factory.CreateClient(
        new Microsoft.AspNetCore.Mvc.Testing.WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false
        });

    // ── Shared valid registration payload ─────────────────────────────────────────
    private const string ValidFirstName = "Nguyen";
    private const string ValidLastName = "Van A";
    private const string ValidPhone = "0811125678"; // matches ^(0[3|5|7|8|9])+([0-8]{8})\b$
    private const string ValidAddress = "123 Le Loi Street, District 1, HCMC";
    private const string ValidRole = "User";
    private const string ValidEmail = "validuser@greeneco.com";
    private const string ValidPassword = "SecureP@ss123";

    // ══════════════════════════════════════════════════════════════════════════════
    // POST /api/auth/register
    // ══════════════════════════════════════════════════════════════════════════════

#region Register – happy path
    [Fact]
    public async Task Register_WithValidData_ShouldReturn200WithId()
    {
        // Arrange
        var payload = BuildRegisterPayload(email: "happypath_register@greeneco.com", phone: "0911125678");

        // Act
        var response = await client.PostAsJsonAsync(
            "/api/auth/register",
            payload,
            TestContext.Current.CancellationToken);

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var body = await response.Content.ReadFromJsonAsync<Dictionary<string, object>>(
            TestContext.Current.CancellationToken);
        Assert.NotNull(body);
        Assert.True(body.ContainsKey("id"), "Response body must contain an 'id' property.");
    }
#endregion

#region Register – duplicate data
    [Fact]
    public async Task Register_WithDuplicateEmail_ShouldReturn400()
    {
        // Arrange – register once successfully
        var payload = BuildRegisterPayload(email: "duplicate_email@greeneco.com", phone: "0833125671");

        var firstResponse = await client.PostAsJsonAsync(
            "/api/auth/register",
            payload,
            TestContext.Current.CancellationToken);
        Assert.Equal(HttpStatusCode.OK, firstResponse.StatusCode);

        // Act – attempt to register with the same e-mail
        var response = await client.PostAsJsonAsync(
            "/api/auth/register",
            payload,
            TestContext.Current.CancellationToken);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Register_WithDuplicatePhone_ShouldReturn400()
    {
        // Arrange – register once with a unique email but a shared phone
        const string sharedPhone = "0799999990";

        var firstPayload = BuildRegisterPayload(email: "dup_phone_first@greeneco.com", phone: sharedPhone);

        var firstResponse = await client.PostAsJsonAsync(
            "/api/auth/register",
            firstPayload,
            TestContext.Current.CancellationToken);
        Assert.Equal(HttpStatusCode.OK, firstResponse.StatusCode);

        // Act – second registration reuses the same phone with a different email
        var secondPayload = BuildRegisterPayload(email: "dup_phone_second@greeneco.com", phone: sharedPhone);

        var response = await client.PostAsJsonAsync(
            "/api/auth/register",
            secondPayload,
            TestContext.Current.CancellationToken);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
#endregion

#region Register – validation failures
    [Theory]
    [InlineData("not-an-email")] // plain invalid format
    [InlineData("missing-at-sign")] // missing @
    [InlineData("@nodomain.com")] // missing local-part
    [InlineData("spaces @test.com")] // space in local-part
    public async Task Register_WithInvalidEmail_ShouldReturn400(string invalidEmail)
    {
        // Arrange
        var payload = BuildRegisterPayload(email: invalidEmail, phone: "0511125670");

        // Act
        var response = await client.PostAsJsonAsync(
            "/api/auth/register",
            payload,
            TestContext.Current.CancellationToken);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Theory]
    [InlineData("")] // empty
    [InlineData(" ")] // whitespace only
    [InlineData("A")] // below MinimumLength(2)
    public async Task Register_WithInvalidFirstName_ShouldReturn400(string invalidFirstName)
    {
        // Arrange
        var payload = BuildRegisterPayload(firstName: invalidFirstName, phone: "0511225670");

        // Act
        var response = await client.PostAsJsonAsync(
            "/api/auth/register",
            payload,
            TestContext.Current.CancellationToken);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Theory]
    [InlineData("")] // empty
    [InlineData(" ")] // whitespace
    [InlineData("B")] // below MinimumLength(2)
    public async Task Register_WithInvalidLastName_ShouldReturn400(string invalidLastName)
    {
        // Arrange
        var payload = BuildRegisterPayload(lastName: invalidLastName, phone: "0511225671");

        // Act
        var response = await client.PostAsJsonAsync(
            "/api/auth/register",
            payload,
            TestContext.Current.CancellationToken);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Theory]
    [InlineData("12345")] // too short (5 digits)
    [InlineData("12345678901")] // too long (11 digits)
    [InlineData("0123456789")] // does not match Vietnamese prefix regex
    [InlineData("abcdefghij")] // non-numeric
    [InlineData("")] // empty
    public async Task Register_WithInvalidPhone_ShouldReturn400(string invalidPhone)
    {
        // Arrange
        var payload = BuildRegisterPayload(phone: invalidPhone);

        // Act
        var response = await client.PostAsJsonAsync(
            "/api/auth/register",
            payload,
            TestContext.Current.CancellationToken);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Theory]
    [InlineData("abc")] // no uppercase, no digit, no special characters
    [InlineData("a@c")] // no uppercase, no digit
    [InlineData("ABCDEF")] // no lowercase, no digit, no special characters
    [InlineData("AB*DEF")] // no lowercase, no digit
    [InlineData("Abcdef")] // no digit, no special characters
    [InlineData("@bcdef")] // no digit
    [InlineData("abcde1")] // no uppercase, no special characters
    [InlineData("ABCDE1")] // no lowercase, no special characters
    [InlineData("Ab1")] // below MinimumLength(6)
    [InlineData("")] // empty
    public async Task Register_WithWeakPassword_ShouldReturn400(string weakPassword)
    {
        // Arrange
        var payload = BuildRegisterPayload(password: weakPassword, phone: "0511225672");

        // Act
        var response = await client.PostAsJsonAsync(
            "/api/auth/register",
            payload,
            TestContext.Current.CancellationToken);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Register_WithMissingAllFields_ShouldReturn400()
    {
        // Arrange – completely empty JSON object
        var payload = new { };

        // Act
        var response = await client.PostAsJsonAsync(
            "/api/auth/register",
            payload,
            TestContext.Current.CancellationToken);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Register_WithEmptyAddress_ShouldReturn400()
    {
        // Arrange
        var payload = BuildRegisterPayload(address: "", phone: "0511225673");

        // Act
        var response = await client.PostAsJsonAsync(
            "/api/auth/register",
            payload,
            TestContext.Current.CancellationToken);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Register_WithAddressTooShort_ShouldReturn400()
    {
        // Arrange – address MinimumLength is 5
        var payload = BuildRegisterPayload(address: "ab", phone: "0511225674");

        // Act
        var response = await client.PostAsJsonAsync(
            "/api/auth/register",
            payload,
            TestContext.Current.CancellationToken);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
#endregion

    // ══════════════════════════════════════════════════════════════════════════════
    // POST /api/auth/login
    // ══════════════════════════════════════════════════════════════════════════════

#region Login – happy path
    [Fact]
    public async Task Login_AfterSuccessfulRegister_ShouldReturn200WithMessageAndSetCookie()
    {
        // Arrange – register first so the user exists in the in-memory DB
        const string email = "login_success@greeneco.com";
        const string password = ValidPassword;
        const string phone = "0855555551";

        var registerPayload = BuildRegisterPayload(email: email, password: password, phone: phone);
        var registerResponse = await client.PostAsJsonAsync(
            "/api/auth/register",
            registerPayload,
            TestContext.Current.CancellationToken);
        Assert.Equal(HttpStatusCode.OK, registerResponse.StatusCode);

        var loginPayload = new { email, password };

        // Act
        var response = await client.PostAsJsonAsync(
            "/api/auth/login",
            loginPayload,
            TestContext.Current.CancellationToken);

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var body = await response.Content.ReadFromJsonAsync<Dictionary<string, string>>(
            TestContext.Current.CancellationToken);
        Assert.NotNull(body);
        Assert.True(body.ContainsKey("message"), "Response must contain 'message'.");
        Assert.False(string.IsNullOrEmpty(body["message"]));
    }
#endregion

#region Login – not-found / wrong credentials
    [Fact]
    public async Task Login_WithNonExistentEmail_ShouldReturn404()
    {
        // Arrange – email was never registered
        var loginPayload = new
        {
            email = "ghost_user_never_registered@greeneco.com",
            password = ValidPassword
        };

        // Act
        var response = await client.PostAsJsonAsync(
            "/api/auth/login",
            loginPayload,
            TestContext.Current.CancellationToken);

        // Assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Login_WithWrongPassword_ShouldReturn404()
    {
        // Arrange – register user then try wrong password
        const string email = "wrong_pwd@greeneco.com";
        const string phone = "0788888881";

        var registerPayload = BuildRegisterPayload(email: email, phone: phone);
        var registerResponse = await client.PostAsJsonAsync(
            "/api/auth/register",
            registerPayload,
            TestContext.Current.CancellationToken);
        Assert.Equal(HttpStatusCode.OK, registerResponse.StatusCode);

        var loginPayload = new { email, password = "WrongPassword999" };

        // Act
        var response = await client.PostAsJsonAsync(
            "/api/auth/login",
            loginPayload,
            TestContext.Current.CancellationToken);

        // Assert – LoginHandler throws NotFoundException for bad credentials
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
#endregion

#region Login – validation failures
    [Theory]
    [InlineData("")] // empty
    [InlineData(" ")] // whitespace
    [InlineData("not-an-email")] // invalid format
    [InlineData("@test.com")] // missing local-part
    public async Task Login_WithInvalidEmailFormat_ShouldReturn400(string invalidEmail)
    {
        // Arrange
        var loginPayload = new { email = invalidEmail, password = ValidPassword };

        // Act
        var response = await client.PostAsJsonAsync(
            "/api/auth/login",
            loginPayload,
            TestContext.Current.CancellationToken);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Login_WithEmptyPassword_ShouldReturn400()
    {
        // Arrange
        var loginPayload = new { email = ValidEmail, password = "" };

        // Act
        var response = await client.PostAsJsonAsync(
            "/api/auth/login",
            loginPayload,
            TestContext.Current.CancellationToken);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Login_WithMissingBothFields_ShouldReturn400()
    {
        // Arrange – empty object, both fields missing
        var loginPayload = new { };

        // Act
        var response = await client.PostAsJsonAsync(
            "/api/auth/login",
            loginPayload,
            TestContext.Current.CancellationToken);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
#endregion

    // ══════════════════════════════════════════════════════════════════════════════
    // POST /api/auth/logout
    // ══════════════════════════════════════════════════════════════════════════════

#region Logout
    [Fact]
    public async Task Logout_WithoutAuth_ShouldReturn200WithMessage()
    {
        // Arrange – no token, no cookie; logout is always available
        // Act
        var response = await client.PostAsJsonAsync("/api/auth/logout", new { }, TestContext.Current.CancellationToken);

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var body = await response.Content.ReadFromJsonAsync<Dictionary<string, string>>(
            TestContext.Current.CancellationToken);
        Assert.NotNull(body);
        Assert.True(body.ContainsKey("message"), "Response must contain 'message'.");
    }

    [Fact]
    public async Task Logout_CalledTwiceConsecutively_ShouldReturn200BothTimes()
    {
        // Act
        var first = await client.PostAsJsonAsync("/api/auth/logout", new { }, TestContext.Current.CancellationToken);
        var second = await client.PostAsJsonAsync("/api/auth/logout", new { }, TestContext.Current.CancellationToken);

        // Assert
        Assert.Equal(HttpStatusCode.OK, first.StatusCode);
        Assert.Equal(HttpStatusCode.OK, second.StatusCode);
    }
#endregion

    // ══════════════════════════════════════════════════════════════════════════════
    // Helpers
    // ══════════════════════════════════════════════════════════════════════════════

    /// <summary>
    /// Builds a valid registration payload, with optional field overrides for
    /// negative-path test cases.
    /// </summary>
    private static RegisterCommand BuildRegisterPayload(string? firstName = null, string? lastName = null,
                                                        string? phone = null, string? address = null,
                                                        string? role = null, string? email = null,
                                                        string? password = null)
    {
        return new RegisterCommand(
            firstName ?? ValidFirstName,
            lastName ?? ValidLastName,
            phone ?? ValidPhone,
            address ?? ValidAddress,
            role ?? ValidRole,
            email ?? ValidEmail,
            password ?? ValidPassword);
    }
}
