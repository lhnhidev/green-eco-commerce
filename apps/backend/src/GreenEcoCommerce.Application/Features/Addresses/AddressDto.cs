using GreenEcoCommerce.Domain.Entities;
using Riok.Mapperly.Abstractions;

namespace GreenEcoCommerce.Application.Features.Addresses;

public record AddressDto(
    Guid Id,
    string Label,
    string RecipientName,
    string Phone,
    string FormattedAddress,
    string? Commune,
    string? Province,
    bool IsDefault
);

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
public static partial class AddressDtoMapper
{
    public static partial AddressDto ToDto(this Address address);
    public static partial IQueryable<AddressDto> ProjectToDto(this IQueryable<Address> addresses);
}
