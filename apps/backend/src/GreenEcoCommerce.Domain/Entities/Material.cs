using GreenEcoCommerce.Domain.Enums;

namespace GreenEcoCommerce.Domain.Entities;

public class Material
{
    public Guid Id { get; set; } = Guid.CreateVersion7();
    public required string Name { get; set; }
    public required MaterialTypeEnum Type { get; set; }
    public int EcoRating { get; set; }

    // --- Fields mở rộng cho trang quản lý Material ---
    public string? Origin { get; set; }          // Nguồn gốc, ví dụ "Việt Nam (Hà Giang)"
    public string? Sku { get; set; }             // Mã SKU, ví dụ "MAT-BMBO-01"
    public decimal StockQty { get; set; }        // Tồn kho hiện tại
    public string? Unit { get; set; }            // Đơn vị, ví dụ "kg", "m²"
    public decimal UnitPrice { get; set; }       // Đơn giá (VND)
    public string? ImageUrl { get; set; }        // Ảnh minh hoạ

    // Navigation Properties
    public ICollection<Product> Products { get; set; } = new HashSet<Product>();
}
