using AutoMapper;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.GreenWallets.Command;

public record CreateGreenWalletCommand(Guid UserId) : IRequest<CreateGreenWalletCommandResponse>;

public class CreateGreenWalletCommandHandler(IGreenWalletRepository greenWalletRepository, IMapper mapper) : IRequestHandler<CreateGreenWalletCommand, CreateGreenWalletCommandResponse>
{
    public async Task<CreateGreenWalletCommandResponse> Handle(CreateGreenWalletCommand command,
        CancellationToken cancellationToken)
    {
        var greenWallet = mapper.Map<GreenWallet>(command);
        await greenWalletRepository.AddGreenWalletAsync(greenWallet);
        return mapper.Map<CreateGreenWalletCommandResponse>(greenWallet);
    }
}
