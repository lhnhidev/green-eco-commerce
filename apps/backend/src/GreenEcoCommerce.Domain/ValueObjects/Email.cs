using System.Text.RegularExpressions;

namespace GreenEcoCommerce.Domain.ValueObjects
{
    public class Email : IEquatable<Email>
    {
        // Regex chuẩn để kiểm tra định dạng email
        private static readonly Regex EmailRegex = new(@"^[^@\s]+@[^@\s]+\.[^@\s]+$", RegexOptions.Compiled | RegexOptions.IgnoreCase);

        public string Value { get; }

        private Email(string value)
        {
            Value = value;
        }

        public static Email Create(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new ArgumentException("Email không được để trống.");

            string trimmedEmail = value.Trim();

            if (!EmailRegex.IsMatch(trimmedEmail))
                throw new ArgumentException("Định dạng Email không hợp lệ.");

            return new Email(trimmedEmail);
        }

        // Ép kiểu ngầm định (Implicit Conversion) từ Email sang string
        public static implicit operator string(Email email) => email?.Value ?? string.Empty;

        // So sánh bằng
        public bool Equals(Email? other)
        {
            if (other is null) return false;
            return string.Equals(Value, other.Value, StringComparison.OrdinalIgnoreCase);
        }

        public override bool Equals(object? obj) => obj is Email other && Equals(other);

        public override int GetHashCode() => Value.ToLowerInvariant().GetHashCode();

        public override string ToString() => Value;
    }
}
