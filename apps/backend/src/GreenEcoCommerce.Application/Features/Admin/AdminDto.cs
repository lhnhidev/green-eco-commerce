namespace GreenEcoCommerce.Application.Features.Admin;

public record AdminDto();

public record GetInfoAnalystQueryResponse(decimal TotalRevenue, int AmountOrders, int AmountUsers, float TotalCo2Saved);
