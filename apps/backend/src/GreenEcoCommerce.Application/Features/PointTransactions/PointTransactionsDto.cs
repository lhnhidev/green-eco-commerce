using AutoMapper;
using GreenEcoCommerce.Application.Features.PointTransactions.Command;
using GreenEcoCommerce.Domain.Entities;

namespace GreenEcoCommerce.Application.Features.PointTransactions;

public record CreatePointTransactionsCommandResponse();

public class PointTransactionProfile : Profile
{
    public PointTransactionProfile()
    {
        CreateMap<CreatePointTransactionsCommand, PointTransaction>();
    }
}
