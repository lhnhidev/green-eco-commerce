using System.Text.RegularExpressions;
using GreenEcoCommerce.Domain.Exceptions;
using Vogen;

namespace GreenEcoCommerce.Domain.ValueObjects;

[ValueObject<string>(toPrimitiveCasting: CastOperator.Implicit, throws: typeof(InvalidEmailException))]
public readonly partial record struct Email
{
    // Regex chuẩn để kiểm tra định dạng email

    [GeneratedRegex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$", RegexOptions.IgnoreCase)]
    private static partial Regex EmailRegex();

    private static string NormalizeInput(string value)
    {
        return string.IsNullOrWhiteSpace(value) ? string.Empty : value.Trim().ToLowerInvariant();
    }

    private static Validation Validate(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return Validation.Invalid("Email must not be empty");
        }

        return !EmailRegex().IsMatch(value) ? Validation.Invalid("Invalid email") : Validation.Ok;
    }
}
