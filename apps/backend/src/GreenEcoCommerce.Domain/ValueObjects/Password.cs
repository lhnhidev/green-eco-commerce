using System.Text.RegularExpressions;
using Vogen;

namespace GreenEcoCommerce.Domain.ValueObjects;

[ValueObject<string>(toPrimitiveCasting: CastOperator.Implicit)]
public readonly partial record struct Password
{
    // Mật khẩu phải từ 6 ký tự, có 1 chữ hoa, 1 chữ thường, 1 số)
    [GeneratedRegex(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$")]
    private static partial Regex PasswordRegex();

    private static Validation Validate(string input)
    {
        if (string.IsNullOrWhiteSpace(input))
        {
            return Validation.Invalid("Mật khẩu không được để trống.");
        }

        return !PasswordRegex().IsMatch(input) ? Validation.Invalid("Mật khẩu phải từ 6 ký tự trở lên, bao gồm ít nhất 1 chữ hoa, 1 chữ thường và 1 chữ số.") : Validation.Ok;
    }

    // Ngăn chặn việc vô tình log mật khẩu thô ra màn hình console
    public override string ToString() => "********";
}
