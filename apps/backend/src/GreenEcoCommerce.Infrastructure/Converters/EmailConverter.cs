using GreenEcoCommerce.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace GreenEcoCommerce.Infrastructure.Converters;

public class EmailConverter() : ValueConverter<Email, string>(
    v => v.Value, // How to save to the DB
    v => Email.Create(v) // How to read from the DB
);
