using GreenEcoCommerce.Application.Features.Uploads.Commands;
using GreenEcoCommerce.Domain.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;

namespace GreenEcoCommerce.WebAPI.Endpoints;

public static class UploadEndpoints
{
    private const long MaxImageSizeBytes = 5 * 1024 * 1024;

    public static void MapUploadEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/uploads")
            .WithTags("Uploads")
            .ProducesProblem(StatusCodes.Status500InternalServerError)
            .RequireAuthorization();

        group.MapPost("/images", UploadImage).DisableAntiforgery();
    }

    private static async Task<Ok<UploadImageCommand.Response>> UploadImage(IFormFile file, ISender sender)
    {
        if (file.Length > MaxImageSizeBytes)
        {
            throw new BadRequestException("Image file is too large. Maximum size is 5 MB.");
        }

        var result = await sender.Send(new UploadImageCommand(file.FileName, file.OpenReadStream()));
        return TypedResults.Ok(result);
    }
}
