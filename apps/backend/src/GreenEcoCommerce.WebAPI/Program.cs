using System.IdentityModel.Tokens.Jwt;
using System.Text;
using FluentValidation;
using GreenEcoCommerce.Application.Behaviors;
using GreenEcoCommerce.Application.Interfaces.Caching;
using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Application.Interfaces.Security;
using GreenEcoCommerce.Domain.Interfaces;
using GreenEcoCommerce.Infrastructure.Caching;
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

var builder = WebApplication.CreateBuilder(args);

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
    cfg.RegisterServicesFromAssembly(typeof(GreenEcoCommerce.Application.Features.Auth.Login.LoginCommand).Assembly);
    cfg.AddOpenBehavior(typeof(ValidationBehavior<,>));
});

// Đăng ký FluentValidation
builder.Services.AddValidatorsFromAssembly(typeof(GreenEcoCommerce.Application.Features.Auth.Login.LoginCommand).Assembly);

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
});

// Thêm kết nối SQL Server, đọc connection string từ appsettings.json)
builder.Services.AddDbContext<IApplicationDbContext, ApplicationDbContext>(options =>
{
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        b => b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)
    )
    .AddInterceptors(auditingInterceptor);
});

// Đăng ký dịch vụ Redis Distributed Cache của Microsoft
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration.GetConnectionString("RedisConnection");
});

// Đăng ký Controllers và cấu hình route convention
builder.Services.AddControllers();
builder.Services.Configure<RouteOptions>(opt =>
{
    opt.LowercaseUrls = true; // Chuyển tất cả URL thành chữ thường
    opt.AppendTrailingSlash = false; // Không thêm dấu / ở cuối URL
});

// Đăng ký ExceptionHanlder
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

// Đăng ký AutoMapper và quét qua tất cả các Profile nằm trong Assembly (Tầng Application)
builder.Services.AddAutoMapper(cfg =>
{
    cfg.AddMaps(typeof(GreenEcoCommerce.Application.Mapping.RegisterCommandToUserProfile));
});

// Đăng ký DI
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<ICacheService, RedisCacheService>();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
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

app.MapFallbackToFile("index.html");

app.Run();
