using System.Security.Claims;

namespace wedding.Extensions;

public static class ClaimsPrincipalExtension
{
    public static string? PartyEmail(this ClaimsPrincipal principal)
    {
        var claim = principal.Claims.FirstOrDefault(c => c.Type == "username");
        try
        {
            return claim!.Value;
        }
        catch
        {
            return null;
        }
    }


    public static string? PartyGuid(this ClaimsPrincipal principal)
    {
        var claim = principal.Claims.FirstOrDefault(c => c.Type == "sessionid");
        try
        {
            return claim!.Value.ToString();
        }
        catch
        {
            return null;
        }
    }
}

