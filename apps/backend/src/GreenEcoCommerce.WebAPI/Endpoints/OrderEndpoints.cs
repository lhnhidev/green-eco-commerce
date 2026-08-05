using System.Security.Claims;
using System.Text;
using ClosedXML.Excel;
using GreenEcoCommerce.Application.Common.Models;
using GreenEcoCommerce.Application.Features.Orders;
using GreenEcoCommerce.Application.Features.Orders.Commands;
using GreenEcoCommerce.Application.Features.Orders.Queries;
using GreenEcoCommerce.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using QuestPDF.Fluent;
using QuestPDF.Helpers;

namespace GreenEcoCommerce.WebAPI.Endpoints;

public static class OrderEndpoints
{
    public static void MapOrderEndpoints(this WebApplication app)
    {
        var adminGroup = app.MapGroup("/api/orders")
                .WithTags("Orders")
                .ProducesProblem(StatusCodes.Status500InternalServerError)
                .RequireAuthorization("AdminOnly");

        adminGroup.MapGet("/", GetAllOrders);
        adminGroup.MapGet("/export", ExportOrdersCsv);
        adminGroup.MapGet("/export.xlsx", ExportOrdersExcel);
        adminGroup.MapGet("/{id:guid}", GetOrderByIdAdmin);
        adminGroup.MapGet("/{id:guid}/invoice.pdf", GetOrderInvoicePdfAdmin);
        adminGroup.MapPatch("/{id:guid}/status", UpdateOrderStatus);

        var userGroup = app.MapGroup("/api/me/orders")
                .WithTags("My Orders")
                .ProducesProblem(StatusCodes.Status500InternalServerError)
                .RequireAuthorization("UserOnly");

        userGroup.MapGet("/", GetMyOrders);
        userGroup.MapGet("/{id:guid}", GetMyOrderById);
        userGroup.MapGet("/{id:guid}/invoice.pdf", GetMyOrderInvoicePdf);
        userGroup.MapPatch("/{id:guid}/cancel", CancelMyOrder);
    }

    private static async Task<Ok<PagedResult<OrderDto>>> GetAllOrders([AsParameters] GetAllOrdersQuery.Parameters query,
                                                                      Guid? userId, ISender sender)
    {
        var orders = await sender.Send(new GetAllOrdersQuery(userId, query));
        return TypedResults.Ok(orders);
    }

    private static async Task<Ok<PagedResult<OrderDto>>> GetMyOrders(ClaimsPrincipal user,
                                                                     [AsParameters] GetAllOrdersQuery.Parameters query,
                                                                     ISender sender)
    {
        string? userIdStr = user.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdStr, out var userId)) throw new UnauthorizedAccessException();
        var orders = await sender.Send(new GetAllOrdersQuery(userId, query));
        return TypedResults.Ok(orders);
    }

    private static async Task<Results<Ok<OrderDto>, NotFound>> GetOrderByIdAdmin(Guid id, ISender sender)
    {
        try
        {
            var order = await sender.Send(new GetOrderDetailsQuery(id));
            return TypedResults.Ok(order);
        }
        catch (KeyNotFoundException) { return TypedResults.NotFound(); }
    }

    private static async Task<Results<Ok<OrderDto>, NotFound, ForbidHttpResult>> GetMyOrderById(
        Guid id, ClaimsPrincipal user, ISender sender)
    {
        string? userIdStr = user.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdStr, out var userId)) throw new UnauthorizedAccessException();
        try
        {
            var order = await sender.Send(new GetOrderDetailsQuery(id));
            if (order.UserId != userId) return TypedResults.Forbid();
            return TypedResults.Ok(order);
        }
        catch (KeyNotFoundException)
        {
            return TypedResults.NotFound();
        }
    }

    private static async Task<Results<NoContent, NotFound, ForbidHttpResult, BadRequest<string>>> CancelMyOrder(
        Guid id, ClaimsPrincipal user, ISender sender)
    {
        string? userIdStr = user.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdStr, out var userId)) throw new UnauthorizedAccessException();
        try
        {
            await sender.Send(new CancelOrderCommand(id, userId));
            return TypedResults.NoContent();
        }
        catch (UnauthorizedAccessException)
        {
            return TypedResults.Forbid();
        }
        catch (InvalidOperationException ex)
        {
            return TypedResults.BadRequest(ex.Message);
        }
        catch (KeyNotFoundException)
        {
            return TypedResults.NotFound();
        }
    }

    private static async Task<Results<NoContent, NotFound>> UpdateOrderStatus(Guid id, UpdateOrderStatusRequest body, ISender sender)
    {
        await sender.Send(new UpdateOrderStatusCommand(id, body.Status));
        return TypedResults.NoContent();
    }

    private static async Task<IResult> ExportOrdersCsv(ISender sender)
    {
        var result = await sender.Send(
            new GetAllOrdersQuery(null, new GetAllOrdersQuery.Parameters { PageSize = 10000 }));
        var sb = new StringBuilder();
        sb.AppendLine("OrderId,Status,DeliveryAddress,TotalAmount,EarnedPoints,DiscountAmount,CreatedAt");

        foreach (var o in result.Items)
        {
            sb.AppendLine($"{o.Id},{o.Status},{o.DeliveryAddress?.Replace(",", " ")},{o.TotalAmount},{o.EarnedPoints},{o.DiscountAmount},{o.CreatedAt:yyyy-MM-dd HH:mm}");
        }
        var bytes = Encoding.UTF8.GetBytes(sb.ToString());
        return Results.File(bytes, "text/csv", $"orders_{DateTime.UtcNow:yyyyMMdd}.csv");
    }

    private static async Task<IResult> ExportOrdersExcel(ISender sender)
    {
        var result = await sender.Send(
            new GetAllOrdersQuery(null, new GetAllOrdersQuery.Parameters { PageSize = 10000 }));

        using var workbook = new XLWorkbook();
        var sheet = workbook.Worksheets.Add("Orders");

        string[] headers = ["Order ID", "Status", "Delivery Address", "Subtotal", "Discount", "Final Amount", "Earned Points", "Created At"];
        for (int i = 0; i < headers.Length; i++)
        {
            sheet.Cell(1, i + 1).Value = headers[i];
            sheet.Cell(1, i + 1).Style.Font.Bold = true;
        }

        int row = 2;
        foreach (var o in result.Items)
        {
            sheet.Cell(row, 1).Value = o.Id.ToString();
            sheet.Cell(row, 2).Value = o.Status.ToString();
            sheet.Cell(row, 3).Value = o.DeliveryAddress;
            sheet.Cell(row, 4).Value = o.TotalAmount;
            sheet.Cell(row, 5).Value = o.DiscountAmount;
            sheet.Cell(row, 6).Value = o.FinalAmount;
            sheet.Cell(row, 7).Value = o.EarnedPoints;
            sheet.Cell(row, 8).Value = o.CreatedAt.ToString("yyyy-MM-dd HH:mm");
            row++;
        }

        sheet.Columns().AdjustToContents();

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);
        return Results.File(
            stream.ToArray(),
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            $"orders_{DateTime.UtcNow:yyyyMMdd}.xlsx");
    }

    private static async Task<Results<FileContentHttpResult, NotFound>> GetOrderInvoicePdfAdmin(Guid id, ISender sender)
    {
        try
        {
            var order = await sender.Send(new GetOrderDetailsQuery(id));
            return TypedResults.File(GenerateInvoicePdf(order), "application/pdf", $"invoice_{id.ToString()[^8..]}.pdf");
        }
        catch (KeyNotFoundException)
        {
            return TypedResults.NotFound();
        }
    }

    private static async Task<Results<FileContentHttpResult, NotFound, ForbidHttpResult>> GetMyOrderInvoicePdf(
        Guid id, ClaimsPrincipal user, ISender sender)
    {
        string? userIdStr = user.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdStr, out var userId)) throw new UnauthorizedAccessException();

        try
        {
            var order = await sender.Send(new GetOrderDetailsQuery(id));
            if (order.UserId != userId) return TypedResults.Forbid();
            return TypedResults.File(GenerateInvoicePdf(order), "application/pdf", $"invoice_{id.ToString()[^8..]}.pdf");
        }
        catch (KeyNotFoundException)
        {
            return TypedResults.NotFound();
        }
    }

    private static byte[] GenerateInvoicePdf(OrderDto order)
    {
        string shortId = order.Id.ToString()[^8..].ToUpperInvariant();

        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(40);
                page.DefaultTextStyle(x => x.FontSize(11));

                page.Header().Row(row =>
                {
                    row.RelativeItem().Column(col =>
                    {
                        col.Item().Text("Green Eco Commerce").FontSize(20).Bold().FontColor(Colors.Green.Darken2);
                        col.Item().Text("Invoice & Shipping Label").FontColor(Colors.Grey.Darken1);
                    });

                    row.RelativeItem().AlignRight().Column(col =>
                    {
                        col.Item().Text($"Order ID: #{shortId}");
                        col.Item().Text($"Date: {order.CreatedAt:dd/MM/yyyy HH:mm}");
                        col.Item().Text($"Status: {order.Status}");
                    });
                });

                page.Content().PaddingTop(20).Column(col =>
                {
                    col.Spacing(8);

                    col.Item().Text("Delivery Details").Bold();
                    col.Item().Text(order.CustomerName);
                    col.Item().Text(order.CustomerPhone);
                    col.Item().Text(order.DeliveryAddress);

                    col.Item().PaddingTop(10).Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.RelativeColumn(3);
                            columns.RelativeColumn();
                            columns.RelativeColumn();
                            columns.RelativeColumn();
                        });

                        table.Header(header =>
                        {
                            header.Cell().Text("Product").Bold();
                            header.Cell().Text("Unit Price").Bold();
                            header.Cell().Text("Qty").Bold();
                            header.Cell().AlignRight().Text("Amount").Bold();
                        });

                        foreach (var item in order.Items)
                        {
                            table.Cell().Text(item.ProductName);
                            table.Cell().Text($"${item.UnitPrice:0.00}");
                            table.Cell().Text(item.Quantity.ToString());
                            table.Cell().AlignRight().Text($"${item.UnitPrice * item.Quantity:0.00}");
                        }
                    });

                    col.Item().PaddingTop(10).AlignRight().Text($"Subtotal: ${order.TotalAmount:0.00}");

                    if (order.DiscountAmount > 0)
                    {
                        col.Item().AlignRight().Text($"Discount: -${order.DiscountAmount:0.00}");
                    }

                    col.Item().AlignRight().Text($"Total: ${order.FinalAmount:0.00}")
                        .Bold().FontSize(14).FontColor(Colors.Green.Darken2);
                });
            });
        });

        return document.GeneratePdf();
    }
}

public record UpdateOrderStatusRequest(OrderStatusEnum Status);
