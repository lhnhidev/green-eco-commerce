using AutoMapper;
using GreenEcoCommerce.Application.Features.GreenWallets.Command;
using GreenEcoCommerce.Domain.Entities;

namespace GreenEcoCommerce.Application.Features.GreenWallets;

public record CreateGreenWalletCommandResponse(Guid Id, Guid UserId, decimal Balance, decimal EarnedTotal, DateTimeOffset? UpdatedAt);

public class GreenWalletProfile : Profile
{
    public GreenWalletProfile()
    {
        CreateMap<CreateGreenWalletCommand, GreenWallet>();
        CreateMap<GreenWallet, CreateGreenWalletCommandResponse>();
    }
}
