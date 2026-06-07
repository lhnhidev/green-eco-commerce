using System.Diagnostics.CodeAnalysis;
using GreenEcoCommerce.Domain.Enums;
using GreenEcoCommerce.Domain.Interfaces;
using GreenEcoCommerce.Domain.ValueObjects;

namespace GreenEcoCommerce.Domain.Entities;

public class User: IHasCreatedAt, IHasUpdatedAt
{
    public Guid Id { get; init; } = Guid.CreateVersion7();
    public required Email Email { get; set; }
    public required string PasswordHash { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string FullName { get; set; }
    public required PhoneNumber Phone { get; set; }
    public required string Address { get; set; }
    public RoleEnum Role { get; set; } = RoleEnum.User;
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }

    // Navigation properties
    public Cart Cart { get; set; } = null!;
    public GreenWallet GreenWallet { get; set; } = null!;
    public ICollection<Order> Orders { get; set; } = new HashSet<Order>();
    public ICollection<ChatSession> ChatSessions { get; set; } = new HashSet<ChatSession>();
    public ICollection<Document> Documents { get; set; } = new HashSet<Document>();

    private User() { }

    [SetsRequiredMembers]
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
