using GreenEcoCommerce.Application.Features.Categories;
using GreenEcoCommerce.Application.Features.Categories.Commands;
using GreenEcoCommerce.Application.Features.Categories.Queries;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace GreenEcoCommerce.WebAPI.Endpoints;

public static class CategoryEndpoints
{
    public static void MapCategoryEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/categories").WithTags("Categories")
                .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapGet("/", GetAllCategories);
        group.MapGet("/{id:guid}", GetCategoryById);
        group.MapPost("/", CreateCategory).RequireAuthorization("AdminOnly");
        group.MapPut("/{id:guid}", UpdateCategory).RequireAuthorization("AdminOnly");
        group.MapDelete("/{id:guid}", DeleteCategory).RequireAuthorization("AdminOnly");
    }

    private static async Task<Ok<List<CategoryDto>>> GetAllCategories(ISender sender)
    {
        var categories = await sender.Send(new GetAllCategoriesQuery());
        return TypedResults.Ok(categories);
    }

    private static async Task<Results<Ok<CategoryDto>, NotFound>> GetCategoryById(Guid id, ISender sender)
    {
        var categories = await sender.Send(new GetCategoryByIdQuery(id));
        return TypedResults.Ok(categories);
    }

    private static async Task<Created<CategoryDto>> CreateCategory([FromBody] CategoryPayloadDto category, ISender sender)
    {
        var createdCategory = await sender.Send(new CategoryPayloadDto(category.Name, category.Description, category.ParentId));
        return TypedResults.Created($"/categories/{createdCategory.Id}", createdCategory);
    }

    private static async Task<Results<Ok<CategoryDto>, NotFound>> UpdateCategory(Guid id, [FromBody] CategoryPayloadDto category, ISender sender)
    {
        var updatedCategory = await sender.Send(new UpdateCategoryCommand(id, category));
        return TypedResults.Ok(updatedCategory);
    }

    private static async Task<NoContent> DeleteCategory(Guid id, ISender sender)
    {
        await sender.Send(new DeleteCategoryCommand(id));

        return TypedResults.NoContent();
    }
}
