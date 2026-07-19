using GreenEcoCommerce.Application.Features.Materials;
using GreenEcoCommerce.Application.Features.Materials.Commands;
using GreenEcoCommerce.Application.Features.Materials.Queries;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;

namespace GreenEcoCommerce.WebAPI.Endpoints;

public static class MaterialEndpoints
{
    public static void MapMaterialEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/materials").WithTags("Materials")
                .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapGet("/", GetAllMaterials);
        group.MapGet("/{id:guid}", GetMaterialById);
        group.MapPost("/", CreateMaterial).RequireAuthorization("AdminOnly");
        group.MapPut("/{id:guid}", UpdateMaterial).RequireAuthorization("AdminOnly");
        group.MapDelete("/{id:guid}", DeleteMaterial).RequireAuthorization("AdminOnly");
    }

    private static async Task<Ok<MaterialDto[]>> GetAllMaterials(ISender sender)
    {
        var materials = await sender.Send(new GetAllMaterialsQuery());
        return TypedResults.Ok(materials);
    }

    private static async Task<Results<Ok<MaterialDto>, NotFound>> GetMaterialById(Guid id, ISender sender)
    {
        var material = await sender.Send(new GetMaterialByIdQuery(id));
        return material != null ? TypedResults.Ok(material) : TypedResults.NotFound();
    }

    private static async Task<Created<MaterialDto>> CreateMaterial(MaterialPayloadDto payload, ISender sender)
    {
        var material = await sender.Send(payload);
        return TypedResults.Created($"/api/Materials/{material.Id}", material);
    }

    private static async Task<Results<NoContent, NotFound>> UpdateMaterial(
        Guid id, MaterialPayloadDto payload, ISender sender)
    {
        await sender.Send(new UpdateMaterialCommand(id, payload));
        return TypedResults.NoContent();
    }

    private static async Task<NoContent> DeleteMaterial(Guid id, ISender sender)
    {
        await sender.Send(new DeleteMaterialCommand(id));
        return TypedResults.NoContent();
    }
}
