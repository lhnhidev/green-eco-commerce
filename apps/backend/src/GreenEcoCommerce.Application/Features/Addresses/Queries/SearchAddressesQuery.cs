using GreenEcoCommerce.Application.Interfaces.Addresses;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Addresses.Queries;

public record SearchAddressesQuery(string Input) : IRequest<AddressSuggestion[]>
{
    public class Handler(IAddressAutocompleteService autocompleteService)
            : IRequestHandler<SearchAddressesQuery, AddressSuggestion[]>
    {
        public Task<AddressSuggestion[]> Handle(SearchAddressesQuery request, CancellationToken ct) =>
                autocompleteService.SearchAsync(request.Input, ct);
    }
}
