using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Application.Interfaces.Security;
using GreenEcoCommerce.Domain.Interfaces;
using GreenEcoCommerce.Infrastructure.Identity;
using GreenEcoCommerce.Infrastructure.Persistence.Context;
using GreenEcoCommerce.Infrastructure.Repositories;
using GreenEcoCommerce.WebAPI.Middlewares;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Dòng này ra lệnh cho .NET: "Khi tạo JWT, hãy giữ nguyên tên gốc, đừng tự ý map sang URI dài của XML nữa!"
JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
JwtSecurityTokenHandler.DefaultOutboundClaimTypeMap.Clear();

// JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
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
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    options.AddPolicy("UserOnly", policy => policy.RequireRole("User"));
    options.AddPolicy("UserOrAdmin", policy => policy.RequireRole("User", "Admin"));
});

// Đăng ký MediatR và quét toàn bộ Assembly chứa class cấu hình
builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssembly(typeof(GreenEcoCommerce.Application.Features.Auth.Login.LoginCommand).Assembly);
});

// Cấu hình CORS (Cho phép React gọi API mà không bị chặn)
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Thêm kết nối SQL Server, đọc connection string từ appsettings.json)
builder.Services.AddDbContext<IApplicationDbContext, ApplicationDbContext>(options =>
{
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        b => b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)
    );
});

// Đăng ký Controllers và cấu hình route convention
builder.Services.AddControllers();

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

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseExceptionHandler();

app.UseRouting();
app.UseHttpsRedirection();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("index.html");

app.Run();
