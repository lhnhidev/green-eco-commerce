namespace GreenEcoCommerce.Application.Interfaces.Storage;

public interface IFileStorageService
{
    Task<string> SaveFileAsync(Stream content, string originalFileName, string subfolder, CancellationToken ct = default);
}
