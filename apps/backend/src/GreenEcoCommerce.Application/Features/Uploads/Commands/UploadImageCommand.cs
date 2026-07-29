using GreenEcoCommerce.Application.Interfaces.Storage;
using GreenEcoCommerce.Domain.Exceptions;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Uploads.Commands;

public record UploadImageCommand(string FileName, Stream FileStream) : IRequest<UploadImageCommand.Response>
{
    private static readonly string[] AllowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

    public record Response(string Url);

    public class Handler(IFileStorageService fileStorage) : IRequestHandler<UploadImageCommand, Response>
    {
        public async Task<Response> Handle(UploadImageCommand request, CancellationToken ct)
        {
            string ext = Path.GetExtension(request.FileName).ToLowerInvariant();

            if (!AllowedExtensions.Contains(ext))
            {
                throw new BadRequestException(
                    $"Unsupported image type '{ext}'. Allowed types: {string.Join(", ", AllowedExtensions)}.");
            }

            string url = await fileStorage.SaveFileAsync(request.FileStream, request.FileName, "images", ct);
            return new Response(url);
        }
    }
}
