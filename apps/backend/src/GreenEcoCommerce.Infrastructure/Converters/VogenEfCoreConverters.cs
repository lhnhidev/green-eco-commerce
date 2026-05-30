using Vogen;

namespace GreenEcoCommerce.Infrastructure.Converters;

[EfCoreConverter<Domain.ValueObjects.Email>]
[EfCoreConverter<Domain.ValueObjects.Password>]
[EfCoreConverter<Domain.ValueObjects.PhoneNumber>]
internal partial class VogenEfCoreConverters;
