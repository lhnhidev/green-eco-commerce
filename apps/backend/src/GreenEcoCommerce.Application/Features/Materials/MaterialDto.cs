using AutoMapper;
using GreenEcoCommerce.Application.Features.Materials.Commands;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Enums;

namespace GreenEcoCommerce.Application.Features.Materials;

public record CreateMaterialResponse(Guid Id, string Name, MaterialTypeEnum Type, int EcoRating);

public record MaterialItem(Guid Id, string Name, MaterialTypeEnum Type, int EcoRating);

public record MaterialUpdateDto(string Name, string Type, int EcoRating);

public class MaterialProfile : Profile
{
    public MaterialProfile()
    {
        CreateMap<CreateMaterialCommand, Material>();
        CreateMap<MaterialUpdateDto, Material>();
        CreateMap<Material, CreateMaterialResponse>();
        CreateMap<Material, MaterialItem>();
        CreateMap<UpdateMaterialCommand, Material>()
            .IncludeMembers(src => src.Dto);
    }
}
