namespace GreenEcoCommerce.Domain.Models;

public class ProductFilterParams
{
    public int PageSize { get; set; } = 10;
    public int PageNumber { get; set; } = 1;
    public string? SearchTerm { get; set; }
    public Guid? CategoryId { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public string? SortBy { get; set; }
    public bool IsDescending { get; set; } = false;
    public bool? IsOrganic { get; set; }
    public bool? IsBiodegradable { get; set; }
    public bool? IsRecycled { get; set; }
}
