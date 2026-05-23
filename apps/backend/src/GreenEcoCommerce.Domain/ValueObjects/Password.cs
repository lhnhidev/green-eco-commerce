using System.Text.RegularExpressions;

namespace GreenEcoCommerce.Domain.ValueObjects
{
    public class Password
    {
        // Mật khẩu phải từ 6 ký tự, có 1 chữ hoa, 1 chữ thường, 1 số)
        private static readonly Regex PasswordRegex = new(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$",RegexOptions.Compiled);

        public string Value { get; }

        private Password(string value) => Value = value;

        public static Password Create(string passwordRaw)
        {
            if (string.IsNullOrWhiteSpace(passwordRaw))
                throw new ArgumentException("Mật khẩu không được để trống.");

            if (!PasswordRegex.IsMatch(passwordRaw))
                throw new ArgumentException("Mật khẩu phải từ 6 ký tự trở lên, bao gồm ít nhất 1 chữ hoa, 1 chữ thường và 1 chữ số.");

            return new Password(passwordRaw);
        }

        // Ngăn chặn việc vô tình log mật khẩu thô ra màn hình console
        public override string ToString() => "********";

        public bool Equals(Password? other) => other is not null && Value == other.Value;
        public override bool Equals(object? obj) => obj is Password other && Equals(other);
        public override int GetHashCode() => Value.GetHashCode();
    }
}
