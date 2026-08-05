using System.Reflection;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.OpenApi;

namespace GreenEcoCommerce.WebAPI.OpenApi;

public class EnforceRequiredSchemaTransformer : IOpenApiSchemaTransformer
{
    public Task TransformAsync(OpenApiSchema schema, OpenApiSchemaTransformerContext context, CancellationToken cancellationToken)
    {
        // Ensure we have properties to process and valid JSON type info
        if (schema.Properties == null)
        {
            return Task.CompletedTask;
        }

        var nullabilityContext = new NullabilityInfoContext();

        // Iterate through all JSON properties mapped for this type
        foreach (var jsonProperty in context.JsonTypeInfo.Properties)
        {
            // Attempt to map the JSON property back to the generated OpenAPI schema property
            if (!schema.Properties.TryGetValue(jsonProperty.Name, out var propertySchema))
            {
                continue;
            }

            // Extract the underlying C# reflection PropertyInfo
            if (jsonProperty.AttributeProvider is PropertyInfo propertyInfo)
            {
                // Condition 1: Is it a computed property? (Has a getter, but no setter)
                bool isComputed = !propertyInfo.CanWrite || propertyInfo.SetMethod == null;

                // Condition 2: Is it a non-nullable value type? (e.g., int, DateTime, Guid)
                bool isNonNullableValueType = propertyInfo.PropertyType.IsValueType &&
                                              Nullable.GetUnderlyingType(propertyInfo.PropertyType) == null;

                // Condition 3: Is it a non-nullable reference type? (e.g., string, object)
                var nullabilityInfo = nullabilityContext.Create(propertyInfo);
                bool isNonNullableRefType = nullabilityInfo.ReadState == NullabilityState.NotNull;

                if (isComputed || isNonNullableValueType || isNonNullableRefType)
                {
                    schema.Required ??= new HashSet<string>();

                    // Add the serialized JSON name to the required list
                    schema.Required.Add(jsonProperty.Name);

                    // Mark computed properties as ReadOnly in the OpenAPI spec
                    if (isComputed)
                    {
                        (propertySchema as OpenApiSchema)?.ReadOnly = true;
                    }
                }
            }
        }

        return Task.CompletedTask;
    }
}
