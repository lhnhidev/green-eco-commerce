using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;
using Riok.Mapperly.Abstractions;

namespace GreenEcoCommerce.Application.Features.PointTransactions.Command;

public partial record CreatePointTransactionsCommand : IRequest<CreatePointTransactionsCommand.Response>
{
    public record Response;

    public class Handler(IPointTransactionRepository pointTransactionRepository) : IRequestHandler<CreatePointTransactionsCommand, Response>
    {
        public async Task<Response> Handle(CreatePointTransactionsCommand command,
                                           CancellationToken ct)
        {
            var greenWalletTransaction = Mapper.ToEntity(command);
            await pointTransactionRepository.AddPointTransactionAsync(greenWalletTransaction, ct);

            return Mapper.ToDto(greenWalletTransaction);
        }
    }

    [Mapper]
    public static partial class Mapper
    {
        public static partial PointTransaction ToEntity(CreatePointTransactionsCommand command);
        public static partial Response ToDto(PointTransaction pointTransaction);
    }
}


