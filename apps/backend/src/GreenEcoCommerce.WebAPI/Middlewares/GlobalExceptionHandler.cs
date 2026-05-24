using System.Net;
using GreenEcoCommerce.Domain.Exceptions;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
// Khai báo namespace chứa NotFoundException của bạn

namespace GreenEcoCommerce.WebAPI.Middlewares;

public class GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        // 1. Log lại lỗi chi tiết ở Server để Developer vào xem khi hệ thống gặp sự cố
        logger.LogError(exception, "Một lỗi xảy ra trong hệ thống: {Message}", exception.Message);

        // 2. Thiết lập các giá trị mặc định (Coi như tất cả là lỗi 500 nếu không khớp các điều kiện dưới)
        var statusCode = HttpStatusCode.InternalServerError;
        string title = "Lỗi Server";
        string detail = "Đã có lỗi hệ thống xảy ra";

        switch (exception)
        {
            // 3. Phân loại Exception để đổi mã lỗi HTTP tương ứng
            case NotFoundException notFoundEx:
                statusCode = HttpStatusCode.NotFound; // 404
                title = "Not Found";
                detail = notFoundEx.Message;
                break;
            case BadRequestException badRequestEx:
                statusCode = HttpStatusCode.BadRequest; // 400
                title = "Bad Request";
                detail = badRequestEx.Message;
                break;
        }

        // 4. Cấu hình HTTP Response trả về cho Client
        httpContext.Response.StatusCode = (int)statusCode;

        // Format dữ liệu lỗi theo chuẩn quốc tế RFC 7807 (Problem Details)
        var problemDetails = new ProblemDetails
        {
            Status = (int)statusCode,
            Title = title,
            Detail = detail,
            Instance = httpContext.Request.Path
        };

        // 5. Trả về JSON sạch đẹp cho Client (Frontend)
        await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);

        return true; // Trả về true để báo với .NET là lỗi này đã được xử lý xong, đừng sập App
    }
}
