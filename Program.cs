var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

var logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateLogger();
// Register Serilog
builder.Logging.AddSerilog(logger);

builder.Services.Configure<AppSettings>(
    builder.Configuration.GetSection(AppSettings.App));

var postgresConn = builder.Configuration.GetConnectionString("Wedding") ?? throw new InvalidOperationException("Connection string 'Wedding' not found.");

builder.Services.AddDbContext<ContextWedding>(options =>
    options.UseNpgsql(postgresConn));

builder.Services.AddControllersWithViews();

builder.Services.AddCustomServices();

builder.Services.AddCors();

builder.Services.AddAuthentication(auth =>
{
    auth.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    auth.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["AppSettings:Issuer"],
        ValidateAudience = true,
        ValidAudience = builder.Configuration["AppSettings:Audience"],
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["AppSettings:Secret"])) {KeyId = builder.Configuration["AppSettings:JWTKeyId"]}
    };
});

#region swagger

if (builder.Environment.IsDevelopment())
{
    builder.Services.AddSwaggerGen(c => {
        c.EnableAnnotations();
        c.SwaggerDoc("v1", new OpenApiInfo { Title = "Wedding API", Version = "v1.0" });

        c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
        {
            Name = "Authorization",
            Type = SecuritySchemeType.ApiKey,
            Scheme = "Bearer",
            BearerFormat = "JWT",
            In = ParameterLocation.Header,
            Description = "JWT Authorization header using the Bearer scheme."
        });

        c.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    System.Array.Empty<string>()

            }
        });
    });
}


#endregion

var app = builder.Build();

app.UseCors(builder =>
{
  builder
     .WithOrigins("http://localhost:44443", "https://localhost:44443")
     .SetIsOriginAllowedToAllowWildcardSubdomains()
     .AllowAnyHeader()
     .AllowCredentials()
     .WithMethods("GET", "PUT", "POST", "DELETE", "OPTIONS")
     .SetPreflightMaxAge(TimeSpan.FromSeconds(3600));
});

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllerRoute(
    name: "default",
    pattern: "/api/{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.Run();
