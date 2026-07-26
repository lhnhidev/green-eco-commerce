using GreenEcoCommerce.Application.Features.Banners;
using GreenEcoCommerce.Application.Features.Banners.Commands;
using GreenEcoCommerce.Application.Features.Banners.Queries;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;

namespace GreenEcoCommerce.WebAPI.Endpoints;

public static class BannerEndpoints
{
    public static void MapBannerEndpoints(this WebApplication app)
    {
        app.MapGet("/api/banners", GetActiveBanners)
           .WithTags("Banners")
           .ProducesProblem(StatusCodes.Status500InternalServerError);

        var adminGroup = app.MapGroup("/api/admin/banners")
           .WithTags("Banners Admin")
           .RequireAuthorization("AdminOnly")
           .ProducesProblem(StatusCodes.Status500InternalServerError);

        adminGroup.MapGet("/", GetAllBanners);
        adminGroup.MapPost("/", CreateBanner);
        adminGroup.MapPut("/{id:guid}", UpdateBanner);
        adminGroup.MapDelete("/{id:guid}", DeleteBanner);
    }

    private static async Task<Ok<BannerDto[]>> GetActiveBanners(ISender sender) =>
        TypedResults.Ok(await sender.Send(new GetActiveBannersQuery()));

    private static async Task<Ok<BannerDto[]>> GetAllBanners(ISender sender) =>
        TypedResults.Ok(await sender.Send(new GetAllBannersQuery()));

    private static async Task<Created<BannerDto>> CreateBanner(BannerPayloadDto command, ISender sender)
    {
        var result = await sender.Send(command);
        return TypedResults.Created($"/api/admin/banners/{result.Id}", result);
    }

    private static async Task<Results<Ok<BannerDto>, NotFound>> UpdateBanner(
        Guid id, BannerPayloadDto command, ISender sender)
    {
        var result = await sender.Send(new UpdateBannerCommand(id, command));
        return result is not null ? TypedResults.Ok(result) : TypedResults.NotFound();
    }

    private static async Task<NoContent> DeleteBanner(Guid id, ISender sender)
    {
        await sender.Send(new DeleteBannerCommand(id));
        return TypedResults.NoContent();
    }
}
