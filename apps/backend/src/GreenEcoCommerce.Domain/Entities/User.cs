using GreenEcoCommerce.Domain.Enums;
using GreenEcoCommerce.Domain.ValueObjects;

namespace GreenEcoCommerce.Domain.Entities;

public class User
{
    public Guid Id { get; init; } = Guid.CreateVersion7();
    public Email Email { get; private set; } = null!;
    public string PasswordHash { get; private set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public PhoneNumber Phone { get; set; } = null!;
    public string Address { get; set; } = string.Empty;
    public RoleEnum Role { get; set; } = RoleEnum.User;
    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;

    private User() { }

    public User(Email email, string passwordHash, string firstName, string lastName, PhoneNumber phone, string address, RoleEnum? role)
    {
        Email = email;
        PasswordHash = passwordHash;
        FirstName = firstName;
        LastName = lastName;
        FullName = $"{lastName} {firstName}";
        Phone = phone;
        Address = address;
        Role = role ?? RoleEnum.User;
    }
}
