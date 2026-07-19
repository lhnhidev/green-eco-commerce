using FluentValidation;
using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Application.Queries;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.GreenWallets.Commands;

public record CreateGreenWalletTransactionCommand(Guid UserId, int Amount, string Description) : IRequest<PointTransactionDto>
{
    public class Handler(IApplicationDbContext dbContext) : IRequestHandler<CreateGreenWalletTransactionCommand, PointTransactionDto>
    {
        public async Task<PointTransactionDto> Handle(CreateGreenWalletTransactionCommand command,
                                                      CancellationToken ct)
        {
            var greenWallet = await dbContext.GreenWallets.OfUser(command.UserId).FirstOrDefaultAsync(ct);
            if (greenWallet == null)
            {
                throw new NotFoundException($"Green wallet for user with ID {command.UserId} not found.");
            }

            PointTransaction transaction;

            if (command.Amount > 0)
            {
                transaction = await dbContext.DepositWalletAsync(
                    greenWallet,
                    Math.Abs(command.Amount),
                    command.Description,
                    ct: ct);
            }
            else
            {
                var t = await dbContext.WithdrawalWalletAsync(
                    greenWallet,
                    Math.Abs(command.Amount),
                    command.Description,
                    ct: ct);

                transaction = t ?? throw new NotFoundException("Insufficient balance.");
            }

            return transaction.ToDto();
        }
    }

    public class Validator : AbstractValidator<CreateGreenWalletTransactionCommand>
    {
        public Validator()
        {
            RuleFor(x => x.UserId)
                    .NotEmpty().WithMessage("Wallet ID must be a valid GUID.");
            RuleFor(x => x.Amount)
                    .NotEqual(0).WithMessage("Amount must not be zero.");
            RuleFor(x => x.Description)
                    .NotEmpty().WithMessage("Description must be a valid description.");
        }
    }
}


