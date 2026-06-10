using GreenEcoCommerce.Application.Features.Materials;
using GreenEcoCommerce.Application.Features.Materials.Commands;
using GreenEcoCommerce.Application.Features.Materials.Queries;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

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

    private static async Task<Ok<MaterialItem>> UpdateMaterial([FromRoute] Guid id, [FromBody] MaterialUpdateDto dto, ISender sender)
    {
        var command = new UpdateMaterialCommand(id, dto);
        var materialItem = await sender.Send(command);
        return TypedResults.Ok(materialItem);
    }

    private static async Task<NoContent> DeleteMaterial([AsParameters] DeleteMaterialCommand command, ISender sender)
    {
        await sender.Send(command);
        return TypedResults.NoContent();
    }

    private static async Task<Ok<MaterialItem>> GetMaterialById([AsParameters] GetMaterialByIdQuery query, ISender sender)
    {
        var material = await sender.Send(query);
        return TypedResults.Ok(material);
    }

    private static async Task<Ok<List<MaterialItem>>> GetAllMaterials([AsParameters] GetAllMaterialsQuery query, ISender sender)
    {
        var materials = await sender.Send(query);
        return TypedResults.Ok(materials);
    }

    private static async Task<Created<CreateMaterialResponse>> CreateMaterial([FromBody] CreateMaterialCommand command, ISender sender)
    {
        var createdMaterial = await sender.Send(command);
        return TypedResults.Created($"/materials/{createdMaterial.Id}", createdMaterial);
    }
}
