using System.Text.RegularExpressions;

namespace GreenEcoCommerce.Domain.ValueObjects;

public partial class Email : IEquatable<Email>
{
    // Regex chuẩn để kiểm tra định dạng email

    [GeneratedRegex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$", RegexOptions.IgnoreCase)]
    private static partial Regex EmailRegex();

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

        return !EmailRegex().IsMatch(trimmedEmail) ? throw new ArgumentException("Định dạng Email không hợp lệ.") : new Email(trimmedEmail);
    }

    // Ép kiểu ngầm định (Implicit Conversion) từ Email sang string
    public static implicit operator string(Email email) => email.Value;

    // So sánh bằng
    public bool Equals(Email? other)
    {
        return other is not null && string.Equals(Value, other.Value, StringComparison.OrdinalIgnoreCase);
    }

    public override bool Equals(object? obj) => obj is Email other && Equals(other);

    public override int GetHashCode() => Value.ToLowerInvariant().GetHashCode();

    public override string ToString() => Value;
}
