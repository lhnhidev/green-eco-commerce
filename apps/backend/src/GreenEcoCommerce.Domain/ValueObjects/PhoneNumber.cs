using GreenEcoCommerce.Domain.Exceptions;
using System.Text;
using System.Text.RegularExpressions;

namespace GreenEcoCommerce.Domain.ValueObjects;

public partial class PhoneNumber
{
    // Regex kiểm tra số điện thoại Việt Nam (10 số, bắt đầu bằng 03, 05, 07, 08, 09)
    [GeneratedRegex("^0[35789][0-9]{8}$")]
    private static partial Regex PhoneRegex();

    public string Value { get; }

    private PhoneNumber(string value) => Value = value;

    public static PhoneNumber Create(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new InvalidPhoneNumberException("Phone number must not be empty.");

        var sb = new StringBuilder(value.Length);
        foreach (char c in value.Where(c => !char.IsWhiteSpace(c))) { sb.Append(c); }

        string cleanedPhone = sb.ToString();

        return !PhoneRegex().IsMatch(cleanedPhone) ? throw new InvalidPhoneNumberException("Invalid phone number") : new PhoneNumber(cleanedPhone);
    }

    // Ép kiểu ngầm định sang string
    public static implicit operator string(PhoneNumber phone) => phone.Value;

    // So sánh bằng
    public bool Equals(PhoneNumber? other) => other is not null && Value == other.Value;
    public override bool Equals(object? obj) => obj is PhoneNumber other && Equals(other);
    public override int GetHashCode() => Value.GetHashCode();
    public override string ToString() => Value;
}
