using FluentValidation;
using GreenEcoCommerce.Application.Interfaces.Configuration;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Admin.Commands;

public record UpdateApplicationSettingsCommand(decimal GreenPointsPerCarbonIndexRatio) : IRequest
{
    public class Handler(IApplicationConfiguration configuration) : IRequestHandler<UpdateApplicationSettingsCommand>
    {
        public async Task Handle(UpdateApplicationSettingsCommand command, CancellationToken ct)
        {
            await configuration.SetGreenPointsPerCarbonIndexRatioAsync(command.GreenPointsPerCarbonIndexRatio, ct);
        }
    }

    public class Validator : AbstractValidator<UpdateApplicationSettingsCommand>
    {
        public Validator()
        {
            RuleFor(x => x.GreenPointsPerCarbonIndexRatio).GreaterThan(0);
        }
    }
}
