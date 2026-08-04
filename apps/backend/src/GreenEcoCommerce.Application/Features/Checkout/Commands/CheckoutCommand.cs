using FluentValidation;
using GreenEcoCommerce.Application.Interfaces.Configuration;
using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Application.Queries;
using GreenEcoCommerce.Domain.Entities;
using GreenEcoCommerce.Domain.Enums;
using GreenEcoCommerce.Domain.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace GreenEcoCommerce.Application.Features.Checkout.Commands;

public record CheckoutCommand(Guid UserId, int PointsToRedeem, string DeliveryAddress, PaymentMethodEnum PaymentMethod, string? CouponCode = null)
        : IRequest<CheckoutCommand.Response>
{
    public record Response(Guid OrderId);

    public class Handler(IApplicationDbContext dbContext, IApplicationConfiguration configuration) : IRequestHandler<CheckoutCommand, Response>
    {
        public async Task<Response> Handle(CheckoutCommand command, CancellationToken ct)
        {
            await using var transaction = await dbContext.BeginTransactionAsync(ct);

            try
            {
                // 1. Get Cart
                var cart = await dbContext.Carts.OfUser(command.UserId).IncludeCartItems().FirstOrDefaultAsync(ct);

                if (cart == null) { throw new NotFoundException("Cart not found for the user."); }

                if (cart.CartItems.Count == 0) { throw new BadRequestException("Cart is empty."); }

                // 2. Validate Stock and Calculate Totals
                decimal totalPrice = 0;
                decimal totalCo2Saved = 0;
                var orderItems = new List<OrderItem>();

                var orderId = Guid.CreateVersion7();

                foreach (var item in cart.CartItems)
                {
                    if (item.Product.StockQty < item.Quantity)
                    {
                        throw new BadRequestException($"Product {item.Product.Name} is out of stock or insufficient.");
                    }

                    // Deduct stock
                    item.Product.StockQty -= item.Quantity; // Persist stock update
                    await dbContext.Products.UpdateStockQtyAsync(item.Product.Id, item.Product.StockQty, ct);

                    decimal subTotal = item.Product.Price * item.Quantity;
                    totalPrice += subTotal;

                    // BaselineCarbonIndex - CarbonIndex = Co2 Saved
                    decimal co2SavedPerUnit = Math.Max(0, item.Product.BaselineCarbonIndex - item.Product.CarbonIndex);
                    totalCo2Saved += co2SavedPerUnit * item.Quantity;

                    orderItems.Add(
                        new OrderItem
                        {
                            OrderId = orderId,
                            ProductId = item.Product.Id,
                            Quantity = item.Quantity,
                            UnitPrice = item.Product.Price,
                            UnitCo2Saved = co2SavedPerUnit
                        });
                }

                // 3. Handle Points
                var wallet = await dbContext.GreenWallets.OfUser(command.UserId).FirstOrDefaultAsync(ct);
                if (wallet == null) { throw new NotFoundException("Green wallet not found for the user."); }

                // 3a. Apply Coupon if provided (mutually exclusive with points redemption, see Validator)
                decimal couponDiscount = 0;
                string? appliedCouponCode = null;
                if (!string.IsNullOrWhiteSpace(command.CouponCode))
                {
                    var coupon = await dbContext.Coupons
                        .FirstOrDefaultAsync(c => c.Code == command.CouponCode.ToUpperInvariant() && c.IsActive, ct);

                    if (coupon == null || coupon.ExpiresAt < DateTimeOffset.UtcNow || coupon.UsedCount >= coupon.MaxUses || totalPrice < coupon.MinOrderAmount)
                    {
                        throw new BadRequestException("This coupon is invalid, expired, or not applicable to this order.");
                    }

                    couponDiscount = coupon.DiscountType == CouponDiscountTypeEnum.Percent
                        ? Math.Round(totalPrice * (coupon.DiscountValue / 100), 2)
                        : Math.Min(coupon.DiscountValue, totalPrice);

                    coupon.UsedCount++;
                    appliedCouponCode = coupon.Code;
                    await dbContext.SaveChangesAsync(ct);
                }

                decimal discountAmount = couponDiscount;
                int earnedPoints;

                if (command.PointsToRedeem > 0)
                {
                    if (wallet.Balance < command.PointsToRedeem)
                    {
                        throw new BadRequestException("Insufficient eco points.");
                    }

                    // 20 points = $1 (or 1 point = $0.05)
                    discountAmount = command.PointsToRedeem / 20m;
                    int actualPointsRedeemed = command.PointsToRedeem;

                    if (discountAmount > totalPrice)
                    {
                        discountAmount = totalPrice;
                        actualPointsRedeemed =
                                (int)Math.Ceiling(discountAmount * 20m); // Adjust points to exact amount needed
                    }

                    if (await dbContext.WithdrawalWalletAsync(wallet, actualPointsRedeemed, $"Redeemed for order {orderId}", orderId, ct) == null)
                    {
                        throw new BadRequestException("Insufficient balance");
                    }

                    earnedPoints = -actualPointsRedeemed;
                }
                else
                {
                    // If user chooses not to redeem points, add points based on configurable ratio
                    earnedPoints = (int)Math.Floor(
                        totalCo2Saved * await configuration.GetGreenPointsPerCarbonIndexRatioAsync(ct));

                    await dbContext.DepositWalletAsync(wallet, earnedPoints, $"Earned from order {orderId}", orderId, ct);
                }

                decimal finalPrice = totalPrice - discountAmount;
                if (finalPrice < 0)
                    throw new InvalidOperationException("Final price cannot be negative after applying discounts.");

                // 4. Create Order & Payment
                await dbContext.Orders.AddAsync(
                    new Order
                    {
                        Id = orderId,
                        UserId = command.UserId,
                        Status = OrderStatusEnum.Pending,
                        DeliveryAddress = command.DeliveryAddress,
                        DiscountAmount = discountAmount,
                        EarnedPoints = earnedPoints,
                        CouponCode = appliedCouponCode,
                        OrderItems = orderItems,
                        Payment = new Payment
                        {
                            OrderId = orderId,
                            Method = command.PaymentMethod,
                            Status = command.PaymentMethod == PaymentMethodEnum.COD
                                    ? PaymentStatusEnum.Pending
                                    : PaymentStatusEnum.Paid,
                            Amount = finalPrice,
                            TransactionRef = Guid.NewGuid().ToString("N") // Placeholder for 3rd party payment ref
                        }
                    },
                    ct);

                await dbContext.SaveChangesAsync(ct);

                // 5. Clear Cart
                await dbContext.Carts.ClearAsync(command.UserId, ct);

                await transaction.CommitAsync(ct);

                return new Response(orderId);
            }
            catch (Exception)
            {
                await transaction.RollbackAsync(ct);
                throw;
            }
        }
    }

    public class Validator : AbstractValidator<CheckoutCommand>
    {
        public Validator()
        {
            RuleFor(x => x.DeliveryAddress)
                .NotEmpty().WithMessage("Delivery address is required.")
                .MaximumLength(500).WithMessage("Delivery address cannot exceed 500 characters.");

            RuleFor(x => x.PointsToRedeem)
                .GreaterThanOrEqualTo(0).WithMessage("Points to redeem cannot be negative.");

            RuleFor(x => x.PaymentMethod)
                .IsInEnum().WithMessage("Invalid payment method.");

            RuleFor(x => x)
                .Must(x => x.PointsToRedeem <= 0 || string.IsNullOrWhiteSpace(x.CouponCode))
                .WithMessage("Cannot combine a coupon and Green Points on the same order — choose one.");
        }
    }
}
