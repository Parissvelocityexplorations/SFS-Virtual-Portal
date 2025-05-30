using System.Text;
using DotEnv.Core;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Npgsql;
using Serilog;
using SpaceForce.VisitorManagement.Data.DbContexts;

var builder = WebApplication.CreateBuilder(args);

new EnvLoader().Load();
builder.Configuration.AddEnvironmentVariables();

Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .CreateLogger();

builder.Host.UseSerilog();

// Add services to the container
builder.Services.AddHttpContextAccessor();

builder.Services.AddCors(o => o.AddPolicy("MyPolicy", b =>
{
    b.AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader();
}));
builder.Services.AddControllers().AddJsonOptions(o =>
{
    o.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    o.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(o =>
{
    o.TokenValidationParameters = new TokenValidationParameters
    {
        ValidIssuer = builder.Configuration["Auth:Jwt:Issuer"],
        ValidAudience = builder.Configuration["Auth:Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey
            (Encoding.UTF8.GetBytes(builder.Configuration["Auth:Jwt:Key"]!)),
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = false,
        ValidateIssuerSigningKey = true
    };
});

var cnxnStringBuilder = new NpgsqlConnectionStringBuilder()
{
    Host = builder.Configuration.GetSection("DB").GetValue<string>("Server"),
    Database = builder.Configuration.GetSection("DB").GetValue<string>("Database"),
    Username = builder.Configuration.GetSection("DB").GetValue<string>("UserId"),
    Password = builder.Configuration.GetSection("DB").GetValue<string>("Password"),
    SearchPath = builder.Configuration.GetSection("DB").GetValue<string>("SearchPath"),
    Port = builder.Configuration.GetSection("DB").GetValue<int>("Port")
};

builder.Services.AddDbContext<SfDbContext>((ctx, options) =>
{
    Console.WriteLine($"connection string:{cnxnStringBuilder.ConnectionString}");
    options.UseNpgsql(cnxnStringBuilder.ConnectionString);
});

builder.Services.AddAuthorization();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

using (var scope = app.Services.CreateScope())
{
    try 
    {
        var db = scope.ServiceProvider.GetRequiredService<SfDbContext>();
        
        // Always recreate the database schema
        Console.WriteLine("Ensuring database is created...");
        await db.Database.EnsureDeletedAsync();
        await db.Database.EnsureCreatedAsync();
        
        Console.WriteLine("Database schema created successfully");
        
        // Seed the database with sample data for development
        if (app.Environment.IsDevelopment())
        {
            Console.WriteLine("Seeding sample data...");
            await SpaceForce.VisitorManagement.Data.Seeds.SampleDataSeeder.SeedSampleDataAsync(db);
            Console.WriteLine("Sample data seeded successfully");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"An error occurred during database initialization: {ex.Message}");
        Console.WriteLine(ex.StackTrace);
        // Continue app startup even if DB setup fails
    }
}

app.UseHttpsRedirection();
app.UseCors("MyPolicy");
app.UseAuthentication();
app.UseAuthorization();

// Add controller for the 'users' route to match the frontend API requests
app.MapControllerRoute(
    name: "users",
    pattern: "users/{id}",
    defaults: new { controller = "User", action = "GetUser" }
);

app.MapControllers();

app.Run();
