using System.Text.RegularExpressions;

namespace GreenEcoCommerce.Domain.ValueObjects
{
    public class PhoneNumber
    {
        // Regex kiểm tra số điện thoại Việt Nam (10 số, bắt đầu bằng 03, 05, 07, 08, 09)
        private static readonly Regex PhoneRegex = new(
            @"^(0[3|5|7|8|9])+([0-8]{8})\b$",
            RegexOptions.Compiled);

        public string Value { get; }

        private PhoneNumber(string value) => Value = value;

        public static PhoneNumber Create(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new ArgumentException("Số điện thoại không được để trống.");

            string cleanedPhone = Regex.Replace(value, @"\s+", "");

            if (!PhoneRegex.IsMatch(cleanedPhone))
                throw new ArgumentException("Số điện thoại không đúng định dạng.");

            return new PhoneNumber(cleanedPhone);
        }

        // Ép kiểu ngầm định sang string
        public static implicit operator string(PhoneNumber phone) => phone?.Value ?? string.Empty;

        // So sánh bằng
        public bool Equals(PhoneNumber? other) => other is not null && Value == other.Value;
        public override bool Equals(object? obj) => obj is PhoneNumber other && Equals(other);
        public override int GetHashCode() => Value.GetHashCode();
        public override string ToString() => Value;
    }
}
