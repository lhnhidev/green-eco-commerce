using GreenEcoCommerce.Application.Interfaces.Persistence;
using GreenEcoCommerce.Domain.Interfaces;
using GreenEcoCommerce.Infrastructure.Persistence.Context;
using GreenEcoCommerce.Infrastructure.Repositories;
using GreenEcoCommerce.WebAPI.Middlewares;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

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
app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("index.html");

app.Run();
