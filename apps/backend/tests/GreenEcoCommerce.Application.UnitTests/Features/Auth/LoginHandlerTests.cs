// using GreenEcoCommerce.Application.Features.Auth.Login;
// using GreenEcoCommerce.Application.Interfaces.Caching;
// using GreenEcoCommerce.Application.Interfaces.Security;
// using GreenEcoCommerce.Domain.Entities;
// using GreenEcoCommerce.Domain.Enums;
// using GreenEcoCommerce.Domain.Exceptions;
// using GreenEcoCommerce.Domain.Interfaces;
// using GreenEcoCommerce.Domain.ValueObjects;
// using Moq;
//
// namespace GreenEcoCommerce.Application.UnitTests.Features.Auth;
//
// public class LoginHandlerTests
// {
//     private readonly Mock<IUserRepository> mockUserRepo;
//     private readonly Mock<IJwtService> mockJwtService;
//     private readonly Mock<ICacheService> mockCacheService;
//     private readonly LoginHandler handler;
//
//     public LoginHandlerTests()
//     {
//         mockUserRepo = new Mock<IUserRepository>();
//         mockJwtService = new Mock<IJwtService>();
//         mockCacheService = new Mock<ICacheService>();
//         handler = new LoginHandler(mockUserRepo.Object, mockJwtService.Object, mockCacheService.Object);
//     }
//
//     private static User CreateValidUser(string rawPassword = "Password1") =>
//             new()
//             {
//                 Email = Email.From("test@example.com"),
//                 PasswordHash = BCrypt.Net.BCrypt.HashPassword(rawPassword),
//                 FirstName = "Test",
//                 LastName = "User",
//                 Phone = PhoneNumber.From("0311111110"),
//                 Address = "123 Test Street",
//                 Role = RoleEnum.User
//             };
//
//     [Fact]
//     public async Task Handle_ShouldReturnToken_WhenCredentialsAreValid()
//     {
//         // Arrange
//         const string rawPassword = "Password1";
//         const string expectedToken = "jwt.token.here";
//         var user = CreateValidUser(rawPassword);
//         var command = new LoginCommand("test@example.com", rawPassword);
//
//         mockUserRepo.Setup(r => r.GetUserByEmailAsync(command.Email)).ReturnsAsync(user);
//         mockJwtService.Setup(s => s.GenerateToken(user)).Returns(expectedToken);
//
//         // Act
//         var result = await handler.Handle(command, CancellationToken.None);
//
//         // Assert
//         Assert.NotNull(result);
//         Assert.Equal(expectedToken, result.Token);
//     }
//
//     [Fact]
//     public async Task Handle_ThrowsNotFoundException_WhenUserNotFound()
//     {
//         // Arrange
//         var command = new LoginCommand("nonexistent@example.com", "Password1");
//
//         mockUserRepo.Setup(r => r.GetUserByEmailAsync(command.Email)).ReturnsAsync((User?)null);
//
//         // Act & Assert
//         var exception = await Assert.ThrowsAsync<NotFoundException>(
//             () => handler.Handle(command, CancellationToken.None));
//
//         Assert.Equal("Not found user, email or password is wrong", exception.Message);
//     }
//
//     [Fact]
//     public async Task Handle_ThrowsNotFoundException_WhenPasswordIsWrong()
//     {
//         // Arrange
//         var user = CreateValidUser("CorrectPassword1");
//         var command = new LoginCommand("test@example.com", "WrongPassword1");
//
//         mockUserRepo.Setup(r => r.GetUserByEmailAsync(command.Email)).ReturnsAsync(user);
//
//         // Act & Assert
//         var exception = await Assert.ThrowsAsync<NotFoundException>(
//             () => handler.Handle(command, CancellationToken.None));
//
//         Assert.Equal("Not found user, email or password is wrong", exception.Message);
//     }
//
//     [Fact]
//     public async Task Handle_ShouldCallGetUserByEmailAsync()
//     {
//         // Arrange
//         const string email = "test@example.com";
//         const string rawPassword = "Password1";
//         var user = CreateValidUser(rawPassword);
//         var command = new LoginCommand(email, rawPassword);
//
//         mockUserRepo.Setup(r => r.GetUserByEmailAsync(email)).ReturnsAsync(user);
//         mockJwtService.Setup(s => s.GenerateToken(user)).Returns("some.jwt.token");
//
//         // Act
//         await handler.Handle(command, CancellationToken.None);
//
//         // Assert
//         mockUserRepo.Verify(r => r.GetUserByEmailAsync(email), Times.Once);
//     }
//
//     [Fact]
//     public async Task Handle_ShouldCallGenerateToken_WhenLoginSucceeds()
//     {
//         // Arrange
//         const string rawPassword = "Password1";
//         var user = CreateValidUser(rawPassword);
//         var command = new LoginCommand("test@example.com", rawPassword);
//
//         mockUserRepo.Setup(r => r.GetUserByEmailAsync(command.Email)).ReturnsAsync(user);
//         mockJwtService.Setup(s => s.GenerateToken(user)).Returns("generated.token");
//
//         // Act
//         await handler.Handle(command, CancellationToken.None);
//
//         // Assert
//         mockJwtService.Verify(s => s.GenerateToken(user), Times.Once);
//     }
//
//     [Fact]
//     public async Task Handle_ShouldNotCallGenerateToken_WhenUserNotFound()
//     {
//         // Arrange
//         var command = new LoginCommand("notfound@example.com", "Password1");
//
//         mockUserRepo.Setup(r => r.GetUserByEmailAsync(command.Email)).ReturnsAsync((User?)null);
//
//         // Act & Assert
//         await Assert.ThrowsAsync<NotFoundException>(() => handler.Handle(command, CancellationToken.None));
//
//         mockJwtService.Verify(s => s.GenerateToken(It.IsAny<User>()), Times.Never);
//     }
//
//     [Fact]
//     public async Task Handle_ShouldNotCallGenerateToken_WhenPasswordIsWrong()
//     {
//         // Arrange
//         var user = CreateValidUser("CorrectPassword1");
//         var command = new LoginCommand("test@example.com", "WrongPassword9");
//
//         mockUserRepo.Setup(r => r.GetUserByEmailAsync(command.Email)).ReturnsAsync(user);
//
//         // Act & Assert
//         await Assert.ThrowsAsync<NotFoundException>(() => handler.Handle(command, CancellationToken.None));
//
//         mockJwtService.Verify(s => s.GenerateToken(It.IsAny<User>()), Times.Never);
//     }
// }
