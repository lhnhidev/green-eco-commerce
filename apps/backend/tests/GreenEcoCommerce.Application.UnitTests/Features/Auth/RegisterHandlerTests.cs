using AutoMapper;
using GreenEcoCommerce.Application.Features.Auth.Register;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Enums;
using GreenEcoCommerce.Domain.Exceptions;
using GreenEcoCommerce.Domain.Interfaces;
using GreenEcoCommerce.Domain.ValueObjects;
using Moq;

namespace GreenEcoCommerce.Application.UnitTests.Features.Auth;

public class RegisterHandlerTests
{
    private readonly Mock<IUserRepository> mockUserRepo;
    private readonly Mock<IMapper> mockMapper;
    private readonly RegisterHandler handler;

    public RegisterHandlerTests()
    {
        mockUserRepo = new Mock<IUserRepository>();
        mockMapper = new Mock<IMapper>();
        handler = new RegisterHandler(mockUserRepo.Object, mockMapper.Object);
    }

    private static RegisterCommand CreateValidCommand(
        string email = "john@example.com",
        string phone = "0311111110") =>
        new("John", "Doe", phone, "123 Main Street", null, email, "Password1");

    private static User CreateValidUser() =>
            new()
            {
                Email = Email.From("john@example.com"),
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password1"),
                FirstName = "John",
                LastName = "Doe",
                Phone = PhoneNumber.From("0311111110"),
                Address = "123 Main Street",
                Role = RoleEnum.User
            };

    [Fact]
    public async Task Handle_ShouldReturnGuid_WhenCommandIsValid()
    {
        // Arrange
        var command = CreateValidCommand();
        var userEntity = CreateValidUser();
        var expectedGuid = Guid.NewGuid();

        mockUserRepo.Setup(r => r.EmailUserExist(command.Email)).ReturnsAsync(false);
        mockUserRepo.Setup(r => r.PhoneNumberUserExist(command.Phone)).ReturnsAsync(false);
        mockMapper.Setup(m => m.Map<User>(command)).Returns(userEntity);
        mockUserRepo.Setup(r => r.AddUserAsync(userEntity)).ReturnsAsync(expectedGuid);

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.Equal(expectedGuid, result);
    }

    [Fact]
    public async Task Handle_ThrowsBadRequestException_WhenEmailAlreadyExists()
    {
        // Arrange
        var command = CreateValidCommand(email: "existing@example.com");

        mockUserRepo.Setup(r => r.EmailUserExist(command.Email)).ReturnsAsync(true);
        mockUserRepo.Setup(r => r.PhoneNumberUserExist(command.Phone)).ReturnsAsync(false);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<BadRequestException>(
            () => handler.Handle(command, CancellationToken.None));

        Assert.Equal("Email was exist", exception.Message);
    }

    [Fact]
    public async Task Handle_ThrowsBadRequestException_WhenPhoneAlreadyExists()
    {
        // Arrange
        var command = CreateValidCommand(phone: "0399999990");

        mockUserRepo.Setup(r => r.EmailUserExist(command.Email)).ReturnsAsync(false);
        mockUserRepo.Setup(r => r.PhoneNumberUserExist(command.Phone)).ReturnsAsync(true);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<BadRequestException>(
            () => handler.Handle(command, CancellationToken.None));

        Assert.Equal("Phone was exist", exception.Message);
    }

    [Fact]
    public async Task Handle_ShouldCallAddUserAsync_WhenNewUser()
    {
        // Arrange
        var command = CreateValidCommand();
        var userEntity = CreateValidUser();
        var expectedGuid = Guid.NewGuid();

        mockUserRepo.Setup(r => r.EmailUserExist(command.Email)).ReturnsAsync(false);
        mockUserRepo.Setup(r => r.PhoneNumberUserExist(command.Phone)).ReturnsAsync(false);
        mockMapper.Setup(m => m.Map<User>(command)).Returns(userEntity);
        mockUserRepo.Setup(r => r.AddUserAsync(userEntity)).ReturnsAsync(expectedGuid);

        // Act
        await handler.Handle(command, CancellationToken.None);

        // Assert
        mockUserRepo.Verify(r => r.AddUserAsync(userEntity), Times.Once);
    }

    [Fact]
    public async Task Handle_ShouldCheckEmailBeforePhone()
    {
        // Arrange - Both email and phone exist; email should throw first
        var command = CreateValidCommand();

        mockUserRepo.Setup(r => r.EmailUserExist(command.Email)).ReturnsAsync(true);
        mockUserRepo.Setup(r => r.PhoneNumberUserExist(command.Phone)).ReturnsAsync(true);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<BadRequestException>(
            () => handler.Handle(command, CancellationToken.None));

        // The email check runs first so email error is thrown
        Assert.Equal("Email was exist", exception.Message);
    }

    [Fact]
    public async Task Handle_ShouldNotCallAddUserAsync_WhenEmailExists()
    {
        // Arrange
        var command = CreateValidCommand();

        mockUserRepo.Setup(r => r.EmailUserExist(command.Email)).ReturnsAsync(true);
        mockUserRepo.Setup(r => r.PhoneNumberUserExist(command.Phone)).ReturnsAsync(false);

        // Act & Assert
        await Assert.ThrowsAsync<BadRequestException>(() => handler.Handle(command, CancellationToken.None));

        mockUserRepo.Verify(r => r.AddUserAsync(It.IsAny<User>()), Times.Never);
    }

    [Fact]
    public async Task Handle_ShouldNotCallAddUserAsync_WhenPhoneExists()
    {
        // Arrange
        var command = CreateValidCommand();

        mockUserRepo.Setup(r => r.EmailUserExist(command.Email)).ReturnsAsync(false);
        mockUserRepo.Setup(r => r.PhoneNumberUserExist(command.Phone)).ReturnsAsync(true);

        // Act & Assert
        await Assert.ThrowsAsync<BadRequestException>(() => handler.Handle(command, CancellationToken.None));

        mockUserRepo.Verify(r => r.AddUserAsync(It.IsAny<User>()), Times.Never);
    }

    [Fact]
    public async Task Handle_ShouldMapUserFromCommand_WhenNewUser()
    {
        // Arrange
        var command = CreateValidCommand();
        var userEntity = CreateValidUser();
        var expectedGuid = Guid.NewGuid();

        mockUserRepo.Setup(r => r.EmailUserExist(command.Email)).ReturnsAsync(false);
        mockUserRepo.Setup(r => r.PhoneNumberUserExist(command.Phone)).ReturnsAsync(false);
        mockMapper.Setup(m => m.Map<User>(command)).Returns(userEntity);
        mockUserRepo.Setup(r => r.AddUserAsync(userEntity)).ReturnsAsync(expectedGuid);

        // Act
        await handler.Handle(command, CancellationToken.None);

        // Assert
        mockMapper.Verify(m => m.Map<User>(command), Times.Once);
    }
}
