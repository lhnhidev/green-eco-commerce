namespace GreenEcoCommerce.Application.Features.Auth.Login;

public record LoginResponse(string Token, UserInfoResponse UserInfo);
