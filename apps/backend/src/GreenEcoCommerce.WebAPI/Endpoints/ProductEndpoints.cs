using GreenEcoCommerce.Application.Features.Products;
using GreenEcoCommerce.Application.Features.Products.Commands;
using GreenEcoCommerce.Application.Features.Products.Queries;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace GreenEcoCommerce.WebAPI.Endpoints;

public static class ProductEndpoints
{
    public static void MapProductEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/products").WithTags("Products")
            .ProducesProblem(StatusCodes.Status500InternalServerError);

        group.MapGet("/", GetProducts);
        group.MapGet("/all", GetAllProducts);
        group.MapGet("/some", GetSomeProducts);
        group.MapGet("/{id:guid}", GetProductById);
        group.MapPost("/", CreateProduct).RequireAuthorization("AdminOnly");
        group.MapPut("/{id:guid}", UpdateProduct).RequireAuthorization("AdminOnly");
        group.MapDelete("/{id:guid}", DeleteProduct).RequireAuthorization("AdminOnly");
    }

    private static async Task<Ok<List<ProductDto>>> GetProducts([FromQuery] int? pageSize, [FromQuery] int? pageNumber, ISender sender)
    {
        if (pageNumber == null && pageSize == null)
        {
            var allProducts = await sender.Send(new GetAllProductsQuery());
            return TypedResults.Ok(allProducts);
        }

        int validatedPageNumber = (pageNumber == null || pageNumber < 1)
            ? 1
            : pageNumber.Value;

        int validatedPageSize = (pageSize == null || pageSize < 1)
            ? 10
            : (pageSize > 50 ? 50 : pageSize.Value);

        // Tạo bản query sạch để gửi đi
        var sanitizedQuery = new GetSomeProductsQuery(validatedPageSize, validatedPageNumber);

        var someProducts = await sender.Send(sanitizedQuery);
        return TypedResults.Ok(someProducts);
    }

    private static async Task<Ok<List<ProductDto>>> GetAllProducts(ISender sender)
    {
        var products = await sender.Send(new GetAllProductsQuery());
        return TypedResults.Ok(products);
    }

    private static async Task<Ok<List<ProductDto>>> GetSomeProducts([AsParameters] GetSomeProductsQuery query, ISender sender)
    {
        var products = await sender.Send(query);
        return TypedResults.Ok(products);
    }

    private static async Task<Ok<ProductDto>> GetProductById(Guid id, ISender sender)
    {
        var product = await sender.Send(new GetProductByIdQuery(id));
        return TypedResults.Ok(product);
    }

    // ✅ Đổi CreateProductCommand → ProductPayloadDto
    private static async Task<Created<ProductDto>> CreateProduct(
        [FromBody] ProductPayloadDto command, ISender sender)
    {
        var created = await sender.Send(command);
        return TypedResults.Created($"/api/products/{created.Id}", created);
    }

    private static async Task<Ok<ProductDto>> UpdateProduct(
        Guid id, [FromBody] ProductPayloadDto dto, ISender sender)
    {
        var updated = await sender.Send(new UpdateProductCommand(id, dto));
        return TypedResults.Ok(updated);
    }

    private static async Task<NoContent> DeleteProduct(Guid id, ISender sender)
    {
        await sender.Send(new DeleteProductCommand(id));
        return TypedResults.NoContent();
    }
}
