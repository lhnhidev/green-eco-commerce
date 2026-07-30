using FluentValidation;
using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Addresses.Commands;

public record CreateAddressCommand(
    Guid UserId,
    string Label,
    string RecipientName,
    string Phone,
    string FormattedAddress,
    string? Commune,
    string? Province,
    string? PlaceId,
    bool IsDefault
) : IRequest<AddressDto>
{
    public class Handler(IApplicationDbContext dbContext) : IRequestHandler<CreateAddressCommand, AddressDto>
    {
        public async Task<AddressDto> Handle(CreateAddressCommand command, CancellationToken ct)
        {
            await using var transaction = await dbContext.BeginTransactionAsync(ct);

            // A user's very first address is always their default, regardless of what was requested.
            var isFirstAddress = !await dbContext.Addresses.AnyAsync(a => a.UserId == command.UserId, ct);
            var makeDefault = command.IsDefault || isFirstAddress;

            if (makeDefault)
            {
                await dbContext.Addresses
                    .Where(a => a.UserId == command.UserId && a.IsDefault)
                    .ExecuteUpdateAsync(set => set.SetProperty(a => a.IsDefault, false), ct);
            }

            var address = new Address
            {
                UserId = command.UserId,
                Label = command.Label,
                RecipientName = command.RecipientName,
                Phone = command.Phone,
                FormattedAddress = command.FormattedAddress,
                Commune = command.Commune,
                Province = command.Province,
                PlaceId = command.PlaceId,
                IsDefault = makeDefault,
            };

            dbContext.Addresses.Add(address);
            await dbContext.SaveChangesAsync(ct);
            await transaction.CommitAsync(ct);

            return address.ToDto();
        }
    }

    public class Validator : AbstractValidator<CreateAddressCommand>
    {
        public Validator()
        {
            RuleFor(x => x.Label).NotEmpty().WithMessage("Label is required.").MaximumLength(50);
            RuleFor(x => x.RecipientName).NotEmpty().WithMessage("Recipient name is required.").MaximumLength(100);
            RuleFor(x => x.Phone).NotEmpty().WithMessage("Phone is required.").MaximumLength(20);
            RuleFor(x => x.FormattedAddress).NotEmpty().WithMessage("Address is required.").MaximumLength(400);
        }
    }
}
