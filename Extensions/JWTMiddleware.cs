using Microsoft.IdentityModel.Logging;

namespace wedding.Extensions;

public class JwtMiddleware
{
    private readonly RequestDelegate _next;
    private readonly AppSettings _appSettings;

public JwtMiddleware(RequestDelegate next, IOptions<AppSettings> appSettings)
{
    _next = next;
    _appSettings = appSettings.Value;
}

    public async Task InvokeAsync(HttpContext context)
    {
        var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last() ?? "";

        var userJwtDto = await ValidateJwtTokenAsync(token);

        if (userJwtDto != null && userJwtDto.PartyEmail != "")
        {
            // attach user to context on successful jwt validation
            context.Items["PartyEmail"] = userJwtDto.PartyEmail;
        }

        await _next(context);
    }

    public async Task<JWTDto?> ValidateJwtTokenAsync(string token)
    {
        if (token == null)
        {
            return null;
        }

        IdentityModelEventSource.ShowPII = true;

        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_appSettings.Secret!);

        tokenHandler.ValidateToken(token, new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key) { KeyId = _appSettings.JWTKeyId },
            ValidateIssuer = false,
            ValidIssuer = _appSettings.Issuer,
            ValidateAudience = true,
            ValidAudience = _appSettings.Audience,
            // set clockskew to zero so tokens expire exactly at token expiration time (instead of 5 minutes later)
            ClockSkew = TimeSpan.Zero
        }, out var validatedToken);

        var jwtToken = (JwtSecurityToken)validatedToken;

        // we have to go through conditional logic here
        var roleType = jwtToken.Claims.First(x => x.Type == "role").Value;

        var partyGuid = jwtToken.Claims.First(x => x.Type == "sessionid").Value;

        var username = jwtToken.Claims.First(x => x.Type == "username").Value;

        // return user id from JWT token if validation successful
        return new JWTDto() {
            PartyEmail = username,
            PartyGuid = new Guid(partyGuid),
            Role = roleType
        };
    }
}

