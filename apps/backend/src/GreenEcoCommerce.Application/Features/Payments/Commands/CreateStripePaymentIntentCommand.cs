using FluentValidation;
using GreenEcoCommerce.Application.Features.Checkout;
using GreenEcoCommerce.Application.Interfaces.Payments;
using GreenEcoCommerce.Application.Interfaces.Persistence;
using MediatR;

namespace GreenEcoCommerce.Application.Features.Payments.Commands;

// Creates a PaymentIntent sized from the user's current cart — no Order exists yet. The order is
// only placed (via CheckoutCommand) once the client confirms this PaymentIntent succeeded, so a
// cancelled/abandoned payment never leaves behind a placed-but-unpaid order.
public record CreateStripePaymentIntentCommand(Guid UserId, int PointsToRedeem, string? CouponCode)
        : IRequest<CreateStripePaymentIntentCommand.Response>
{
    public record Response(string ClientSecret, string PublishableKey);

    public class Handler(IApplicationDbContext dbContext, IStripeService stripeService)
            : IRequestHandler<CreateStripePaymentIntentCommand, Response>
    {
        public async Task<Response> Handle(CreateStripePaymentIntentCommand command, CancellationToken ct)
        {
            decimal finalPrice = await CheckoutPricing.ComputeFinalPriceAsync(
                    dbContext, command.UserId, command.PointsToRedeem, command.CouponCode, ct);

            (string clientSecret, _) = await stripeService.CreatePaymentIntentAsync(
                    finalPrice, "GreenEco cart checkout", ct);

            return new Response(clientSecret, stripeService.PublishableKey);
        }
    }

    public class Validator : AbstractValidator<CreateStripePaymentIntentCommand>
    {
        public Validator()
        {
            RuleFor(x => x.PointsToRedeem).GreaterThanOrEqualTo(0);
            RuleFor(x => x)
                    .Must(x => x.PointsToRedeem <= 0 || string.IsNullOrWhiteSpace(x.CouponCode))
                    .WithMessage("Cannot combine a coupon and Green Points on the same order — choose one.");
        }
    }
}
