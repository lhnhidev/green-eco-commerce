using System.Security.Claims;
using GreenEcoCommerce.Application.Features.Addresses;
using GreenEcoCommerce.Application.Features.Addresses.Commands;
using GreenEcoCommerce.Application.Features.Addresses.Queries;
using GreenEcoCommerce.Application.Interfaces.Addresses;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;

namespace GreenEcoCommerce.WebAPI.Endpoints;

public static class AddressEndpoints
{
    public static void MapAddressEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/me/addresses").WithTags("Addresses")
                .ProducesProblem(StatusCodes.Status500InternalServerError)
                .RequireAuthorization("UserOnly");

        group.MapGet("/", GetMyAddresses);
        group.MapPost("/", CreateAddress);
        group.MapPut("/{id:guid}", UpdateAddress);
        group.MapDelete("/{id:guid}", DeleteAddress);
        group.MapPatch("/{id:guid}/default", SetDefaultAddress);

        // Not user-data-scoped, but still requires authentication so the Goong key can't be farmed.
        app.MapGet("/api/addresses/autocomplete", SearchAddresses)
           .WithTags("Addresses")
           .RequireAuthorization()
           .ProducesProblem(StatusCodes.Status500InternalServerError);
    }

    private static async Task<Ok<AddressSuggestion[]>> SearchAddresses(string input, ISender sender)
    {
        var result = await sender.Send(new SearchAddressesQuery(input));
        return TypedResults.Ok(result);
    }

    private static async Task<Ok<AddressDto[]>> GetMyAddresses(ClaimsPrincipal user, ISender sender)
    {
        var userId = GetUserId(user);
        var result = await sender.Send(new GetMyAddressesQuery(userId));
        return TypedResults.Ok(result);
    }

    private static async Task<Ok<AddressDto>> CreateAddress(
        AddressRequest body, ClaimsPrincipal user, ISender sender)
    {
        var userId = GetUserId(user);
        var result = await sender.Send(new CreateAddressCommand(
            userId, body.Label, body.RecipientName, body.Phone, body.FormattedAddress,
            body.Commune, body.Province, body.PlaceId, body.IsDefault));
        return TypedResults.Ok(result);
    }

    private static async Task<Ok<AddressDto>> UpdateAddress(
        Guid id, AddressRequest body, ClaimsPrincipal user, ISender sender)
    {
        var userId = GetUserId(user);
        var result = await sender.Send(new UpdateAddressCommand(
            id, userId, body.Label, body.RecipientName, body.Phone, body.FormattedAddress,
            body.Commune, body.Province, body.PlaceId));
        return TypedResults.Ok(result);
    }

    private static async Task<NoContent> DeleteAddress(Guid id, ClaimsPrincipal user, ISender sender)
    {
        var userId = GetUserId(user);
        await sender.Send(new DeleteAddressCommand(id, userId));
        return TypedResults.NoContent();
    }

    private static async Task<NoContent> SetDefaultAddress(Guid id, ClaimsPrincipal user, ISender sender)
    {
        var userId = GetUserId(user);
        await sender.Send(new SetDefaultAddressCommand(id, userId));
        return TypedResults.NoContent();
    }

    private static Guid GetUserId(ClaimsPrincipal user)
    {
        string? userIdStr = user.FindFirstValue(ClaimTypes.NameIdentifier);
        return !Guid.TryParse(userIdStr, out var userId) ? throw new UnauthorizedAccessException() : userId;
    }
}

public record AddressRequest(
    string Label,
    string RecipientName,
    string Phone,
    string FormattedAddress,
    string? Commune,
    string? Province,
    string? PlaceId,
    bool IsDefault
);
