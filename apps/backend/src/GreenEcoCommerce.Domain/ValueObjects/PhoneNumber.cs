using GreenEcoCommerce.Domain.Exceptions;
using System.Text;
using System.Text.RegularExpressions;
using Vogen;

namespace GreenEcoCommerce.Domain.ValueObjects;

[ValueObject<string>(toPrimitiveCasting: CastOperator.Implicit, throws: typeof(InvalidPhoneNumberException))]
public readonly partial record struct PhoneNumber
{
    // Regex kiểm tra số điện thoại Việt Nam (10 số, bắt đầu bằng 03, 05, 07, 08, 09)
    [GeneratedRegex("^0[35789][0-9]{8}$")]
    private static partial Regex PhoneRegex();

    private static string NormalizeInput(string input)
    {
        if (string.IsNullOrWhiteSpace(input))
            return string.Empty;

        var sb = new StringBuilder(input.Length);
        foreach (char c in input.Where(c => !char.IsWhiteSpace(c)))
        {
            sb.Append(c);
        }

        return sb.ToString();
    }

    private static Validation Validate(string input)
    {
        if (string.IsNullOrWhiteSpace(input))
        {
            return Validation.Invalid("Phone number must not be empty.");
        }

        return PhoneRegex().IsMatch(input) ? Validation.Ok : Validation.Invalid("Invalid phone number");
    }
}
