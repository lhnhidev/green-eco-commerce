using GreenEcoCommerce.Application.Features.Coupons;
using GreenEcoCommerce.Application.Features.Coupons.Commands;
using GreenEcoCommerce.Application.Features.Coupons.Queries;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;

namespace GreenEcoCommerce.WebAPI.Endpoints;

public static class CouponEndpoints
{
    public static void MapCouponEndpoints(this WebApplication app)
    {
        // Public/authenticated: validate a coupon code
        app.MapPost("/api/coupons/validate", ValidateCoupon)
           .WithTags("Coupons")
           .RequireAuthorization()
           .ProducesProblem(StatusCodes.Status400BadRequest)
           .ProducesProblem(StatusCodes.Status500InternalServerError);

        // Admin CRUD
        var adminGroup = app.MapGroup("/api/admin/coupons")
           .WithTags("Coupons Admin")
           .RequireAuthorization("AdminOnly")
           .ProducesProblem(StatusCodes.Status500InternalServerError);

        adminGroup.MapGet("/", GetAllCoupons);
        adminGroup.MapPost("/", CreateCoupon);
        adminGroup.MapPut("/{id:guid}", UpdateCoupon);
        adminGroup.MapDelete("/{id:guid}", DeleteCoupon);
    }

    private static async Task<Results<Ok<ValidateCouponResponse>, BadRequest<string>>> ValidateCoupon(
        ValidateCouponRequest body, ISender sender)
    {
        try
        {
            var result = await sender.Send(new ValidateCouponQuery(body.Code, body.OrderTotal));
            return TypedResults.Ok(result);
        }
        catch (Exception ex)
        {
            return TypedResults.BadRequest(ex.Message);
        }
    }

    private static async Task<Ok<CouponDto[]>> GetAllCoupons([AsParameters] GetAllCouponsQuery query, ISender sender) =>
        TypedResults.Ok(await sender.Send(query));

    private static async Task<Created<CouponDto>> CreateCoupon(CreateCouponCommand command, ISender sender)
    {
        var result = await sender.Send(command);
        return TypedResults.Created($"/api/admin/coupons/{result.Id}", result);
    }

    private static async Task<Results<Ok<CouponDto>, NotFound>> UpdateCoupon(
        Guid id, UpdateCouponCommand command, ISender sender)
    {
        var result = await sender.Send(command with { Id = id });
        return result is not null ? TypedResults.Ok(result) : TypedResults.NotFound();
    }

    private static async Task<Results<NoContent, NotFound>> DeleteCoupon(Guid id, ISender sender)
    {
        var ok = await sender.Send(new DeleteCouponCommand(id));
        return ok ? TypedResults.NoContent() : TypedResults.NotFound();
    }
}

public record ValidateCouponRequest(string Code, decimal OrderTotal);
