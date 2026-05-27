using Microsoft.AspNetCore.OpenApi;
using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace GreenEcoCommerce.WebAPI.OpenApi
{
    public class DocFilter : IOpenApiOperationTransformer
    {

        public async Task TransformAsync(OpenApiOperation operation, OpenApiOperationTransformerContext context, CancellationToken cancellationToken)
        {
            var controllerName = context.Description.ActionDescriptor.RouteValues["controller"];
            var actionName = context.Description.ActionDescriptor.RouteValues["action"];
            var key = $"{controllerName}_{actionName}";

            // 2. Nếu tìm thấy cấu hình tài liệu cho Key này trong kho
            if (ApiDocStorage.Endpoints.TryGetValue(key, out var doc))
            {
                operation.Description = doc.Description;

                // 3. Quét qua danh sách các mã Response để nạp nội dung mô tả
                foreach (var res in doc.Responses)
                {
                    var statusCode = res.Key;
                    var descriptionText = res.Value;

                    operation.Responses ??= new OpenApiResponses();

                    // Nếu Endpoint ở Controller đã khai báo mã này, tiến hành cập nhật text
                    if (operation.Responses.TryGetValue(statusCode, out var openApiResponse))
                    {
                        openApiResponse.Description = descriptionText;
                    }
                    else
                    {
                        // Nếu Controller chưa khai báo, tự tạo mới trường Response đó
                        operation.Responses.Add(statusCode, new OpenApiResponse
                        {
                            Description = descriptionText
                        });
                    }
                }
            }
        }
    }
}
