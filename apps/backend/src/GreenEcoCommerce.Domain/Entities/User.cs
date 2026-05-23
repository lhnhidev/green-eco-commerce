using GreenEcoCommerce.Domain.Enums;
using GreenEcoCommerce.Domain.ValueObjects;

namespace GreenEcoCommerce.Domain.Entities
{
    public class User
    {
        public Guid Id { get; private set; }
        public Email Email { get; private set; } = null!;
        public string PasswordHash { get; private set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public PhoneNumber Phone { get; set; } = null!;
        public string AddressDefault { get; set; } = string.Empty;
        public RoleEnum Role { get; set; }
        public DateTime CreatedAt { get; set; }

        private User() { }

        // Không truyền role vào thì mặc định là user
        public User(
            Email email,
            string passwordHash,
            string firstName,
            string lastName,
            PhoneNumber phone,
            string addressDefault,
            RoleEnum? role
        )
        {
            Id = Guid.NewGuid();

            Email = email;
            PasswordHash = passwordHash;
            FirstName = firstName.Trim();
            LastName = lastName.Trim();
            FullName = firstName + " " + lastName;
            Phone = phone;
            AddressDefault = addressDefault;
            Role = role ?? RoleEnum.User;

            CreatedAt = DateTime.Now;
        }
    }
}
