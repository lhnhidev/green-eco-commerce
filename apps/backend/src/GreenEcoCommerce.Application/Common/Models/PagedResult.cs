namespace GreenEcoCommerce.Application.Common.Models;

public class PagedResult<T>
{
    public required T[] Items { get; init; } = [];
    public required int TotalCount { get; init; }
    public required int PageNumber { get; init; }
    public required int PageSize { get; init; }
    public int TotalPages => PageSize > 0 ? (int)Math.Ceiling(TotalCount / (double)PageSize) : 0;
}
