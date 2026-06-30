namespace GreenEcoCommerce.Application.Features.CheckoutProducts;

public record ProductInfo(Guid ProductId, int AmountProduct);

// DTO định nghĩa kết quả trả về chi tiết cho từng Item trong giỏ hàng checkout
public record CheckoutItemDto(Guid ProductId, string Name, decimal Price, int Quantity, decimal SubTotal);

// DTO Response chứa các thông tin tổng kết (Tổng số loại, tổng số lượng, tổng tiền)
public record CreateCheckoutProductsCommandResponse(
    int TotalUniqueProducts,  // Tổng số loại product (Số lượng hàng/dòng)
    int TotalItemsCount,      // Tổng số lượng sản phẩm (Cộng dồn cột số lượng)
    decimal TotalPrice,       // Tổng số tiền phải trả
    List<CheckoutItemDto> Items
);
