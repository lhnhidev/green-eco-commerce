using GreenEcoCommerce.Application.Interfaces.Environment;
using GreenEcoCommerce.Application.Interfaces.Storage;

namespace GreenEcoCommerce.Infrastructure.Storage;

public class FileStorageService(IApplicationEnvironment env) : IFileStorageService
{
    public async Task<string> SaveFileAsync(Stream content, string originalFileName, string subfolder, CancellationToken ct = default)
    {
        string ext = Path.GetExtension(originalFileName);
        string uploadFolder = Path.Combine(env.WebRootPath, "uploads", subfolder);

        if (!Directory.Exists(uploadFolder))
        {
            Directory.CreateDirectory(uploadFolder);
        }

        string uniqueFileName = $"{Guid.NewGuid()}{ext}";
        string filePath = Path.Combine(uploadFolder, uniqueFileName);

        await using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await content.CopyToAsync(stream, ct);
        }

        return $"/uploads/{subfolder}/{uniqueFileName}";
    }
}
