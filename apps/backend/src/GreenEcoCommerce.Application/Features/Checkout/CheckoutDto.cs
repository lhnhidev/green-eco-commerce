namespace GreenEcoCommerce.Application.Features.Checkout;

// DTO định nghĩa kết quả trả về chi tiết cho từng Item trong giỏ hàng checkout
public record CheckoutItemDto(Guid ProductId, string Name, decimal Price, int Quantity, decimal SubTotal);

