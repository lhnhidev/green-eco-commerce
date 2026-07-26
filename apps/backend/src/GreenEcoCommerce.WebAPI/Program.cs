using System.IdentityModel.Tokens.Jwt;
using System.Reflection;
using System.Text;
using System.Text.Json.Serialization;
using EntityFramework.Exceptions.PostgreSQL;
using FluentValidation;
using GreenEcoCommerce.Application.Behaviors;
using GreenEcoCommerce.Application.Features.Auth.Commands;
using GreenEcoCommerce.Application.Interfaces.Caching;
using GreenEcoCommerce.Application.Interfaces.Chatbot;
using GreenEcoCommerce.Application.Interfaces.Configuration;
using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Application.Interfaces.Security;
using GreenEcoCommerce.Domain.Interfaces;
using GreenEcoCommerce.Infrastructure.Caching;
using GreenEcoCommerce.Infrastructure.ChatbotServices;
using GreenEcoCommerce.Infrastructure.Configuration;
using GreenEcoCommerce.Infrastructure.Identity;
using GreenEcoCommerce.Infrastructure.Persistence;
using GreenEcoCommerce.Infrastructure.Persistence.Context;
using GreenEcoCommerce.Infrastructure.Repositories;
using GreenEcoCommerce.WebAPI.Middlewares;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;
using GreenEcoCommerce.WebAPI.Endpoints;
using GreenEcoCommerce.WebAPI.OpenApi;
using Microsoft.AspNetCore.OpenApi;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

// Khi tạo JWT sẽ giữ nguyên tên gốc, không tự ý map sang URI dài của XML
JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
JwtSecurityTokenHandler.DefaultOutboundClaimTypeMap.Clear();

// JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                // Đọc token từ cookie thay vì Authorization header
                context.Token = context.Request.Cookies["AccessToken"];
                return Task.CompletedTask;
            }
        };

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:SecretKey"]!))
        };
    });

// Authorization Policies
builder.Services.AddAuthorizationBuilder()
    .AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"))
    .AddPolicy("UserOnly", policy => policy.RequireRole("User"))
    .AddPolicy("UserOrAdmin", policy => policy.RequireRole("User", "Admin"));

// Create a singleton instance if it doesn't require scoped dependencies.
// If it requires scoped dependencies (like an ICurrentUserService), register the interceptor
// in DI and resolve it here.
var auditingInterceptor = new AuditingInterceptor();

// Đăng ký MediatR và quét toàn bộ Assembly chứa class cấu hình
builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssembly(typeof(LoginCommand).Assembly);
    cfg.AddOpenBehavior(typeof(ValidationBehavior<,>));
});

// Đăng ký FluentValidation
builder.Services.AddValidatorsFromAssembly(typeof(LoginCommand).Assembly);

// Cấu hình CORS (Cho phép React gọi API mà không bị chặn)
builder.Services.AddCors(options =>
{
    options.AddPolicy("CORS", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // BẮT BUỘC: Cho phép gửi/nhận Cookie
    });
});

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi(opt =>
{
    opt.AddDocumentTransformer((document, _, _) =>
    {
        document.Info.Title = "GreenEcoCommerce API";
        document.Info.Version = "v1";
        document.Info.Description = "API GreenEcoCommerce app - app for buying and selling green products";

        return Task.CompletedTask;
    });

    opt.AddSchemaTransformer<EnforceRequiredSchemaTransformer>();

    opt.AddOperationTransformer((operation, context, _) =>
    {
        // Find the method name from the endpoint metadata
        var endpointMetadata = context.Description.ActionDescriptor.EndpointMetadata;
        var methodInfo = endpointMetadata.OfType<MethodInfo>().FirstOrDefault();

        if (methodInfo != null)
        {
            operation.OperationId = methodInfo.Name;
        }

        return Task.CompletedTask;
    });

    opt.CreateSchemaReferenceId = typeInfo =>
    {
        var type = typeInfo.Type;

        // Check if it's a nested class
        if (type.IsNested)
        {
            // Start with the innermost class name (stripping generic backticks if present)
            string schemaId = type.Name.Split('`')[0];
            var currentType = type;

            // Walk up the nested hierarchy and prepend parent class names
            while (currentType is { IsNested: true, DeclaringType: not null })
            {
                currentType = currentType.DeclaringType;
                string parentName = currentType.Name.Split('`')[0];

                // Combine with a dot
                schemaId = $"{parentName}.{schemaId}";
            }

            return schemaId; // Yields: OuterClass.InnerClass
        }

        // Use Microsoft's default behavior for all other types
        return OpenApiOptions.CreateDefaultSchemaReferenceId(typeInfo);
    };
});

// Thêm kết nối SQL Server, đọc connection string từ appsettings.json)
builder.AddNpgsqlDbContext<ApplicationDbContext>(
    "GreenEcoCommerce-DB",
    null,
    options =>
    {
        options.UseNpgsql(npgsqlOptions =>
        {
            npgsqlOptions.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName);
        }).AddInterceptors(auditingInterceptor).UseExceptionProcessor();
    });
builder.Services.AddScoped<IApplicationDbContext, ApplicationDbContext>(provider =>
        provider.GetRequiredService<ApplicationDbContext>());

// Đăng ký dịch vụ Redis Distributed Cache của Microsoft
builder.AddRedisDistributedCache("cache");

// Đăng ký Controllers và cấu hình route convention
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    options.JsonSerializerOptions.NumberHandling = JsonNumberHandling.Strict;
});
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
    options.SerializerOptions.NumberHandling = JsonNumberHandling.Strict;
});
builder.Services.Configure<RouteOptions>(opt =>
{
    opt.LowercaseUrls = true; // Chuyển tất cả URL thành chữ thường
    opt.AppendTrailingSlash = false; // Không thêm dấu / ở cuối URL
});

// Đăng ký ExceptionHanlder
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

// Đăng ký DI
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<ICacheService, RedisCacheService>();

builder.Services.AddHttpClient<IAiService, AiService>(client =>
{
    client.BaseAddress = new Uri("https://generativelanguage.googleapis.com/");
});

builder.Services.AddScoped<IChatSessionRepository, ChatSessionRepository>();
builder.Services.AddScoped<IAppConfigurationRepository, AppConfigurationRepository>();
builder.Services.AddScoped<IApplicationConfiguration, ApplicationConfiguration>();

var app = builder.Build();

app.MapDefaultEndpoints();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    await dbContext.Database.MigrateAsync();

    if (app.Environment.IsDevelopment())
    {
        await DbSeeder.SeedAsync(dbContext);
    }
}

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseExceptionHandler();

app.UseRouting();
app.UseHttpsRedirection();
app.UseCors("CORS");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapCategoryEndpoints();
app.MapMaterialEndpoints();
app.MapProductEndpoints();
app.MapProfileEndpoints();
app.MapChatbotEndpoints();
app.MapCartEndpoints();
app.MapChatSessionEndpoints();
app.MapOrderEndpoints();
app.MapMeStatisticsEndpoints();
app.MapPaymentEndpoints();
app.MapGreenWalletEndpoints();
app.MapUserEndpoints();
app.MapAdminEndpoints();
app.MapCheckoutEndpoints();
app.MapReviewEndpoints();
app.MapCouponEndpoints();

app.MapFallbackToFile("index.html");

app.Run();
