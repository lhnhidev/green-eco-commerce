using AutoMapper;
using GreenEcoCommerce.Domain.Entities;

namespace GreenEcoCommerce.Application.Features.Carts;

public record CartItemDto(
    Guid ProductId,
    string ProductName,
    decimal ProductPrice,
    string[] ProductImageUrl,
    int Quantity
);

public record CartDto(
    Guid Id,
    Guid UserId,
    List<CartItemDto> Items,
    decimal TotalPrice
);

public record AddCartItemPayloadDto(Guid ProductId, int Quantity = 1);

public record UpdateCartItemPayloadDto(int Quantity);

public class CartDtoProfile : Profile
{
    public CartDtoProfile()
    {
        CreateMap<CartItem, CartItemDto>()
            .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.Name))
            .ForMember(dest => dest.ProductPrice, opt => opt.MapFrom(src => src.Product.Price))
            .ForMember(dest => dest.ProductImageUrl, opt => opt.MapFrom(src => src.Product.ImageUrl));

        CreateMap<Cart, CartDto>()
            .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.CartItems))
            .ForMember(dest => dest.TotalPrice, opt => opt.MapFrom(src =>
                src.CartItems.Sum(ci => ci.Quantity * ci.Product.Price)));
    }
}
