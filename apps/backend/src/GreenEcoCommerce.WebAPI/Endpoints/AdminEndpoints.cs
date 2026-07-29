using ClosedXML.Excel;
using GreenEcoCommerce.Application.Features.Admin.Queries;
using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;

namespace GreenEcoCommerce.WebAPI.Endpoints;

public static class AdminEndpoints
{
    public static void MapAdminEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/admin").WithTags("Admin")
            .ProducesProblem(StatusCodes.Status500InternalServerError)
            .ProducesProblem(StatusCodes.Status401Unauthorized)
            .ProducesProblem(StatusCodes.Status403Forbidden)
            .RequireAuthorization("AdminOnly");

        group.MapGet("/analyst", GetInfoAnalyst);
        group.MapGet("/analyst/export.xlsx", ExportAnalystExcel);
        group.MapGet("/best-selling", GetBestSellingProducts);
    }

    private static async Task<Ok<GetInfoAnalystQuery.Response>> GetInfoAnalyst([AsParameters] GetInfoAnalystQuery query, ISender sender)
    {
        var result = await sender.Send(query);
        return TypedResults.Ok(result);
    }

    private static async Task<Ok<GetBestSellingProductsQuery.Response[]>> GetBestSellingProducts(ISender sender, int top = 10)
    {
        var result = await sender.Send(new GetBestSellingProductsQuery(top));
        return TypedResults.Ok(result);
    }

    private static async Task<IResult> ExportAnalystExcel([AsParameters] GetInfoAnalystQuery query, ISender sender)
    {
        var result = await sender.Send(query);

        using var workbook = new XLWorkbook();
        var sheet = workbook.Worksheets.Add($"Report {query.Month:00}-{query.Year}");

        string[] headers = ["Metric", "Current Period", "Previous Period", "Growth %"];
        for (int i = 0; i < headers.Length; i++)
        {
            sheet.Cell(1, i + 1).Value = headers[i];
            sheet.Cell(1, i + 1).Style.Font.Bold = true;
        }

        sheet.Cell(2, 1).Value = "Total Revenue ($)";
        sheet.Cell(2, 2).Value = result.TotalRevenue.CurrentValue;
        sheet.Cell(2, 3).Value = result.TotalRevenue.PreviousValue;
        sheet.Cell(2, 4).Value = result.TotalRevenue.GrowthPercentage;

        sheet.Cell(3, 1).Value = "Orders";
        sheet.Cell(3, 2).Value = result.AmountOrders.CurrentValue;
        sheet.Cell(3, 3).Value = result.AmountOrders.PreviousValue;
        sheet.Cell(3, 4).Value = result.AmountOrders.GrowthPercentage;

        sheet.Cell(4, 1).Value = "New Users";
        sheet.Cell(4, 2).Value = result.AmountUsers.CurrentValue;
        sheet.Cell(4, 3).Value = result.AmountUsers.PreviousValue;
        sheet.Cell(4, 4).Value = result.AmountUsers.GrowthPercentage;

        sheet.Cell(5, 1).Value = "CO2 Saved (kg)";
        sheet.Cell(5, 2).Value = (double)result.TotalCo2Saved.CurrentValue;
        sheet.Cell(5, 3).Value = (double)result.TotalCo2Saved.PreviousValue;
        sheet.Cell(5, 4).Value = result.TotalCo2Saved.GrowthPercentage;

        sheet.Columns().AdjustToContents();

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);
        return Results.File(
            stream.ToArray(),
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            $"revenue_report_{query.Year}-{query.Month:00}.xlsx");
    }
}

