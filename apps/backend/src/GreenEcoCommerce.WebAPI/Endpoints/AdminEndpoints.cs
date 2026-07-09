using GreenEcoCommerce.Application.Features.Admin;
using GreenEcoCommerce.Application.Features.Admin.Queries;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace GreenEcoCommerce.WebAPI.Endpoints;

public static class AdminEndpoints
{
    public static void MapAdminEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/admin").WithTags("Admin")
            .ProducesProblem(StatusCodes.Status500InternalServerError)
            .RequireAuthorization("AdminOnly");

        group.MapGet("/analyst", GetInfoAnalyst);
    }

    private static async Task<Ok<GetInfoAnalystQueryResponse>> GetInfoAnalyst([AsParameters] GetInfoAnalystQuery query, ISender sender)
    {
        var result = await sender.Send(query);
        return TypedResults.Ok(result);
    }
}
