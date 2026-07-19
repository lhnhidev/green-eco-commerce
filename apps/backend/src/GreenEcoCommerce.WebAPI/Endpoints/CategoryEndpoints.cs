using GreenEcoCommerce.Application.Features.Categories;
using GreenEcoCommerce.Application.Features.Categories.Commands;
using GreenEcoCommerce.Application.Features.Categories.Queries;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;

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

    private static async Task<Ok<CategoryDto[]>> GetAllCategories(ISender sender)
    {
        var categories = await sender.Send(new GetAllCategoriesQuery());
        return TypedResults.Ok(categories);
    }

    private static async Task<Results<Ok<CategoryDto>, NotFound>> GetCategoryById(Guid id, ISender sender)
    {
        var category = await sender.Send(new GetCategoryByIdQuery(id));
        return category != null ? TypedResults.Ok(category) : TypedResults.NotFound();
    }

    private static async Task<Created<CategoryDto>> CreateCategory(CategoryPayloadDto payload, ISender sender)
    {
        var category = await sender.Send(payload);
        return TypedResults.Created($"/api/categories/{category.Id}", category);
    }

    private static async Task<Results<NoContent, NotFound>> UpdateCategory(
        Guid id, CategoryPayloadDto payload, ISender sender)
    {
        await sender.Send(new UpdateCategoryCommand(id, payload));
        return TypedResults.NoContent();
    }

    private static async Task<NoContent> DeleteCategory(Guid id, ISender sender)
    {
        await sender.Send(new DeleteCategoryCommand(id));
        return TypedResults.NoContent();
    }
}
