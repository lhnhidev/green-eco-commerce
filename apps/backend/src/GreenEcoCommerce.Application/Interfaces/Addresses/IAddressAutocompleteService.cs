namespace GreenEcoCommerce.Application.Interfaces.Addresses;

public record AddressSuggestion(
    string Description,
    string PlaceId,
    string MainText,
    string SecondaryText,
    string? Commune,
    string? Province
);

public interface IAddressAutocompleteService
{
    Task<AddressSuggestion[]> SearchAsync(string input, CancellationToken ct = default);
}
