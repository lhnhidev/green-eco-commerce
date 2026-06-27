using AutoMapper;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Interfaces;
using MediatR;

namespace GreenEcoCommerce.Application.Features.PointTransactions.Command;

public record CreatePointTransactionsCommand : IRequest<CreatePointTransactionsCommandResponse>;

public class CreatePointTransactionCommandHandler(IPointTransactionRepository pointTransactionRepository, IMapper mapper) : IRequestHandler<CreatePointTransactionsCommand, CreatePointTransactionsCommandResponse>
{
    public async Task<CreatePointTransactionsCommandResponse> Handle(CreatePointTransactionsCommand command,
        CancellationToken cancellationToken)
    {
        var greenWalletTransaction = mapper.Map<PointTransaction>(command);
        await pointTransactionRepository.AddPointTransactionAsync(greenWalletTransaction);

        return mapper.Map<CreatePointTransactionsCommandResponse>(greenWalletTransaction);
    }
}
