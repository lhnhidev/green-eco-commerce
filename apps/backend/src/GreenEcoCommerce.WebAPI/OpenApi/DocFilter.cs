using Microsoft.AspNetCore.OpenApi;
using Microsoft.OpenApi;

namespace GreenEcoCommerce.WebAPI.OpenApi;

public class DocFilter : IOpenApiOperationTransformer
{
    public Task TransformAsync(OpenApiOperation operation, OpenApiOperationTransformerContext context, CancellationToken ct)
    {
        try
        {
            // 1. Try to get a unique key for the endpoint
            string key = GetEndpointKey(context);

            if (string.IsNullOrEmpty(key)) return Task.CompletedTask;

            // 2. Nếu tìm thấy cấu hình tài liệu cho Key này trong kho
            if (!ApiDocStorage.Endpoints.TryGetValue(key, out var doc)) { return Task.CompletedTask; }

            operation.Description = doc.Description;

            // 3. Quét qua danh sách các mã Response để nạp nội dung mô tả
            foreach ((string statusCode, string descriptionText) in doc.Responses)
            {
                operation.Responses ??= new OpenApiResponses();

                // Nếu Endpoint đã khai báo mã này, tiến hành cập nhật text
                if (operation.Responses.TryGetValue(statusCode, out var openApiResponse))
                {
                    openApiResponse.Description = descriptionText;
                }
                else
                {
                    // Nếu chưa khai báo, tự tạo mới trường Response đó
                    operation.Responses.Add(statusCode, new OpenApiResponse
                    {
                        Description = descriptionText
                    });
                }
            }

            return Task.CompletedTask;
        }
        catch (Exception exception) { return Task.FromException(exception); }
    }

    private static string GetEndpointKey(OpenApiOperationTransformerContext context)
    {
        // Strategy A: Check for Endpoint Name / Operation ID (Great for Minimal APIs)
        var endpointMetadata = context.Description.ActionDescriptor.EndpointMetadata;
        var routeNameMetadata = endpointMetadata.OfType<IEndpointNameMetadata>().FirstOrDefault();

        if (routeNameMetadata != null)
        {
            return routeNameMetadata.EndpointName; // Returns "GetUsers", "CreateProduct", etc.
        }

        // Strategy B: Fallback to Controller/Action for traditional Controllers
        var routeValues = context.Description.ActionDescriptor.RouteValues;
        if (routeValues.TryGetValue("controller", out var controller) &&
            routeValues.TryGetValue("action", out var action))
        {
            return $"{controller}_{action}";
        }

        // Strategy C: Absolute fallback using HTTP Method + Route Template
        return $"{context.Description.HttpMethod}_{context.Description.RelativePath}";
    }
}
