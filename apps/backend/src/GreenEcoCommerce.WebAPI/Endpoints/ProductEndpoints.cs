using GreenEcoCommerce.Application.Common.Models;
using GreenEcoCommerce.Application.Features.Products;
using GreenEcoCommerce.Application.Features.Products.Commands;
using GreenEcoCommerce.Application.Features.Products.Queries;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;

namespace GreenEcoCommerce.WebAPI.Endpoints;

public static class ProductEndpoints
{
    public static void MapProductEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/products").WithTags("Products")
                .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapGet("/", GetAllProducts);
        group.MapGet("/compare", GetProductsByIds);
        group.MapGet("/{id:guid}", GetProductById);
        group.MapGet("/{id:guid}/related", GetRelatedProducts);
        group.MapPost("/", CreateProduct).RequireAuthorization("AdminOnly");
        group.MapPut("/{id:guid}", UpdateProduct).RequireAuthorization("AdminOnly");
        group.MapDelete("/{id:guid}", DeleteProduct).RequireAuthorization("AdminOnly");
    }

    private static async Task<Ok<PagedResult<ProductDto>>> GetAllProducts(
        [AsParameters] GetAllProductsQuery.Parameters query, ISender sender)
    {
        var products = await sender.Send(new GetAllProductsQuery(query));
        return TypedResults.Ok(products);
    }

    private static async Task<Ok<ProductDto[]>> GetProductsByIds(Guid[] ids, ISender sender)
    {
        var products = await sender.Send(new GetProductsByIdsQuery(ids));
        return TypedResults.Ok(products);
    }

    private static async Task<Results<Ok<ProductDto>, NotFound>> GetProductById(Guid id, ISender sender)
    {
        var product = await sender.Send(new GetProductByIdQuery(id));
        return product != null ? TypedResults.Ok(product) : TypedResults.NotFound();
    }

    private static async Task<Ok<ProductDto[]>> GetRelatedProducts(Guid id, ISender sender, int limit = 8)
    {
        var products = await sender.Send(new GetRelatedProductsQuery(id, limit));
        return TypedResults.Ok(products);
    }

    private static async Task<Created<ProductDto>> CreateProduct(ProductPayloadDto payload, ISender sender)
    {
        var product = await sender.Send(payload);
        return TypedResults.Created($"/api/products/{product.Id}", product);
    }

    private static async Task<Results<NoContent, NotFound>> UpdateProduct(
        Guid id, ProductPayloadDto payload, ISender sender)
    {
        await sender.Send(new UpdateProductCommand(id, payload));
        return TypedResults.NoContent();
    }

    private static async Task<NoContent> DeleteProduct(Guid id, ISender sender)
    {
        await sender.Send(new DeleteProductCommand(id));
        return TypedResults.NoContent();
    }
}

