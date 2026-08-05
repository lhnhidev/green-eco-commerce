using System.Security.Claims;
using GreenEcoCommerce.Application.Features.Documents;
using GreenEcoCommerce.Application.Features.Documents.Commands;
using GreenEcoCommerce.Application.Features.Documents.Queries;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;

namespace GreenEcoCommerce.WebAPI.Endpoints;

public static class DocumentEndpoints
{
    public static void MapDocumentEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/admin/documents")
            .WithTags("Documents")
            .ProducesProblem(StatusCodes.Status500InternalServerError)
            .RequireAuthorization("AdminOnly");

        group.MapGet("/", GetDocuments);
        group.MapPost("/upload", UploadDocument).DisableAntiforgery();
        group.MapDelete("/{id:guid}", DeleteDocument);
    }

    private static async Task<Ok<DocumentDto[]>> GetDocuments(ISender sender)
    {
        var result = await sender.Send(new GetDocumentsQuery());
        return TypedResults.Ok(result);
    }

    private static async Task<Ok<DocumentDto>> UploadDocument(
        IFormFile file, ClaimsPrincipal user, ISender sender)
    {
        string? userIdStr = user.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdStr, out var userId)) throw new UnauthorizedAccessException();

        var result = await sender.Send(new UploadDocumentCommand(userId, file.FileName, file.OpenReadStream()));
        return TypedResults.Ok(result);
    }

    private static async Task<NoContent> DeleteDocument(Guid id, ISender sender)
    {
        await sender.Send(new DeleteDocumentCommand(id));
        return TypedResults.NoContent();
    }
}
