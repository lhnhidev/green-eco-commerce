using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;
using Riok.Mapperly.Abstractions;

namespace GreenEcoCommerce.Application.Features.GreenWallets.Command;

public partial record CreateGreenWalletCommand(Guid UserId) : IRequest<CreateGreenWalletCommand.Response>
{
    public record Response(Guid Id, Guid UserId, decimal Balance, decimal EarnedTotal, DateTimeOffset? UpdatedAt);

    public class Handler(IGreenWalletRepository greenWalletRepository)
            : IRequestHandler<CreateGreenWalletCommand, Response>
    {
        public async Task<Response> Handle(CreateGreenWalletCommand command, CancellationToken ct)
        {
            var greenWallet = Mapper.ToEntity(command);
            await greenWalletRepository.AddGreenWalletAsync(greenWallet, ct);
            return Mapper.ToDto(greenWallet);
        }
    }

    [Mapper]
    public static partial class Mapper
    {
        public static partial Response ToDto(GreenWallet greenWallet);
        public static partial GreenWallet ToEntity(CreateGreenWalletCommand command);
    }
}
