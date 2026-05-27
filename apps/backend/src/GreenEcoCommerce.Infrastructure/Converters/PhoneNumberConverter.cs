using GreenEcoCommerce.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace GreenEcoCommerce.Infrastructure.Converters;

public class PhoneNumberConverter() : ValueConverter<PhoneNumber, string>(
    v => v.Value, // How to save to the DB
    v => PhoneNumber.Create(v) // How to read from the DB
);
