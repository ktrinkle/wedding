
namespace wedding.Models;

public class AppSettings
{
    public const string App = "AppSettings";
    public string? Secret { get; set; }
    public string? Salt { get; set; }
    public string Issuer { get; set; } = String.Empty;
    public string Audience { get; set; } = String.Empty;
    public string JWTKeyId { get; set; } = String.Empty;
    public string Password { get; set; } = String.Empty;
}

