using HabaNabatAPI.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ===============================
// CORS - السماح للموقع المحلي + Vercel
// ===============================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5173",
                "https://habatnabat-system-2.vercel.app"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// ===============================
// Controllers
// ===============================
builder.Services.AddControllers();

// ===============================
// Database
// ===============================
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    ));

// ===============================
// Swagger
// ===============================
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ===============================
// Swagger
// ===============================
app.UseSwagger();
app.UseSwaggerUI();

// ===============================
// CORS
// ===============================
app.UseCors("AllowReact");

// ===============================
// HTTPS
// ===============================
app.UseHttpsRedirection();

// ===============================
// Authorization
// ===============================
app.UseAuthorization();

// ===============================
// Controllers
// ===============================
app.MapControllers();

// ===============================
// Test endpoint
// ===============================
app.MapGet("/test", () => "HabaNabat API Works!");

// ===============================
// Run
// ===============================
app.Run();