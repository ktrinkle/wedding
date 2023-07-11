using Microsoft.Extensions.DependencyInjection.Extensions;

namespace wedding.Config
{
    public static class ServicesConfiguration
    {
        public static void AddCustomServices(this IServiceCollection services)
        {
            // Services
            services.TryAddScoped<ILoginService, LoginService>();
            services.TryAddScoped<IRsvpService, RsvpService>();
            services.TryAddScoped<IAdminService, AdminService>();

           // services.TryAddScoped<IClaimsTransformation, AddRolesClaimsTransformation>();
        }
    }
}
