using FluentValidation;
using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Addresses.Commands;

public record UpdateAddressCommand(
    Guid AddressId,
    Guid UserId,
    string Label,
    string RecipientName,
    string Phone,
    string FormattedAddress,
    string? Commune,
    string? Province,
    string? PlaceId
) : IRequest<AddressDto>
{
    public class Handler(IApplicationDbContext dbContext) : IRequestHandler<UpdateAddressCommand, AddressDto>
    {
        public async Task<AddressDto> Handle(UpdateAddressCommand command, CancellationToken ct)
        {
            var address = await dbContext.Addresses
                .FirstOrDefaultAsync(a => a.Id == command.AddressId && a.UserId == command.UserId, ct)
                ?? throw new NotFoundException("Address not found.");

            address.Label = command.Label;
            address.RecipientName = command.RecipientName;
            address.Phone = command.Phone;
            address.FormattedAddress = command.FormattedAddress;
            address.Commune = command.Commune;
            address.Province = command.Province;
            address.PlaceId = command.PlaceId;

            await dbContext.SaveChangesAsync(ct);

            return address.ToDto();
        }
    }

    public class Validator : AbstractValidator<UpdateAddressCommand>
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
