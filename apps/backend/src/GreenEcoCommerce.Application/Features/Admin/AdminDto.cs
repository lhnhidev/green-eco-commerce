using AutoMapper;
using GreenEcoCommerce.Domain.Entities;

namespace GreenEcoCommerce.Application.Features.Admin;

public record AdminDto();

public record Revenue(decimal CurrentValue, decimal PreviousValue, decimal GrowthPercentage, bool IsGrowth);
public record Orders(int CurrentValue, int PreviousValue, decimal GrowthPercentage, bool IsGrowth);
public record Users(int CurrentValue, int PreviousValue, decimal GrowthPercentage, bool IsGrowth);
public record Co2Saved(float CurrentValue, float PreviousValue, float GrowthPercentage, bool IsGrowth);

public record GetInfoAnalystQueryResponse(Revenue TotalRevenue, Orders AmountOrders, Users AmountUsers, Co2Saved TotalCo2Saved);

public class AdminProfile : Profile
{
    public AdminProfile()
    {
    }
}
