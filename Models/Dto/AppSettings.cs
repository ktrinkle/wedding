
namespace wedding.Models;

public class Storage
{
    public string? SasKey { get; set; }
    public string? AccountKey { get; set; }
    public string? AccountUrl { get; set; }
    public string? AccountName { get; set; }
}

public class AppSettings
{
    public const string App = "AppSettings";
    public string? Secret { get; set; }
    public string? Salt { get; set; }
    public string Issuer { get; set; } = String.Empty;
    public string Audience { get; set; } = String.Empty;
    public string JWTKeyId { get; set; } = String.Empty;
    public string Password { get; set; } = String.Empty;
    public string AdminUser { get; set; } = String.Empty;
    public string AdminPassword { get; set; } = String.Empty;
    public string AdminGuid { get; set; } = String.Empty;
    public Storage AzureStorage { get; set; } = new Storage();
}

