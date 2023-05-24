using System.Security.Claims;

namespace wedding.Services;

public class LoginService : ILoginService
{
    private readonly ContextWedding _ContextWedding;
    private readonly ILogger<LoginService> _logger;
    private readonly AppSettings _appSettings;

    public LoginService(ILogger<LoginService> logger, ContextWedding context, IOptions<AppSettings> appSettings)
    {
        _logger = logger;
        _ContextWedding = context;
        _appSettings = appSettings.Value;
    }

    public async Task<BearerDto> LoginAsync(string emailAddr, string password)
    {
        /*
        This is a very simple login method just calling for the email address.
        We also require a fixed password from AppSettings.
        */
        
        var loginInfo = await _ContextWedding.WeddingGroup.FirstOrDefaultAsync(u => u.EmailAddress.ToLower() == emailAddr.ToLower());
        if (loginInfo is null)
        {
            return null;
        }

        var fixedPwd = _appSettings.Password;
        if (password.ToLower() != fixedPwd.ToLower())
        {
            return null;
        }

        // Make sure we save that someone has looked at this.

        loginInfo.LastLoginDate = DateTime.UtcNow;
        _ContextWedding.WeddingGroup.Update(loginInfo);
        await _ContextWedding.SaveChangesAsync();

        var returnUser = new BearerDto()
        {
            PartyGuid = loginInfo.GroupId.ToString(),
            PartyAddress = loginInfo.EmailAddress,
            BearerToken = GenerateToken(loginInfo.GroupId, loginInfo.EmailAddress)
        };

        return returnUser;
    }

    public async Task<BearerDto> LoginAdminAsync(string emailAddr, string password)
    {
        /*
        This is a very simple login method just calling for the email address.
        We also require a fixed password from AppSettings.
        */
        
        var loginInfo = await _ContextWedding.WeddingGroup.FirstOrDefaultAsync(u => u.EmailAddress.ToLower() == emailAddr.ToLower());
        if (emailAddr != _appSettings.AdminUser)
        {
            return null;
        }

        var fixedPwd = _appSettings.AdminPassword;
        if (password.ToLower() != fixedPwd.ToLower())
        {
            return null;
        }

        var returnUser = new BearerDto()
        {
            PartyGuid = _appSettings.AdminGuid.ToString(),
            PartyAddress = _appSettings.AdminUser,
            BearerToken = GenerateToken(new Guid(_appSettings.AdminGuid), _appSettings.AdminUser)
        };

        return returnUser;
    }

    public async Task<WeddingPartyDto?> GetPartyEmailAsync(string emailAddr)
    {
        var partyGuid = await _ContextWedding.WeddingGroup.FirstOrDefaultAsync(w => w.EmailAddress == emailAddr);

        if (partyGuid is null)
        {
            return null;
        }

        return await GetPartyAsync(partyGuid.GroupId.ToString());
    }

    public async Task<WeddingPartyDto?> GetPartyAsync(string partyGuid)
    {
        var party = new Guid(partyGuid);

        var weddingParty = await (from w in _ContextWedding.WeddingGroup
                                select new WeddingPartyDto()
                                {
                                    GroupId = w.GroupId,
                                    EmailAddress = w.EmailAddress,
                                    PartyMembers = (from wg in _ContextWedding.WeddingGroupName
                                                    where w.GroupId == wg.GroupId
                                                    select new WeddingPartyMemberDto()
                                                    {
                                                        GroupMemberId = wg.GroupMemberId,
                                                        GroupMemberName = wg.GroupMemberName,
                                                        RsvpYes = wg.RsvpYes,
                                                        RsvpComment = wg.RsvpComment
                                                    }).ToList()
                                }).FirstOrDefaultAsync();

        return weddingParty;                 
    }

    private string GenerateToken(Guid partyGuid, string? emailAddress)
    {
        var appSecret = Encoding.UTF8.GetBytes(_appSettings.Secret!);
        var appSecurityKey = new SymmetricSecurityKey(appSecret) { KeyId = _appSettings.JWTKeyId };

        var appIssuer = _appSettings.Issuer;
        var appAudience = _appSettings.Audience;

        var claims = new ClaimsIdentity(new Claim[]
        {
            new Claim("sessionid", partyGuid.ToString()),
            new Claim("username", emailAddress ?? ""),
        });

        if (emailAddress == _appSettings.AdminUser)
        {
            claims.AddClaim(new Claim("role", "Admin"));
        }

        var tokenHandler = new JwtSecurityTokenHandler();
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = claims,
            Expires = DateTime.UtcNow.AddHours(4),
            Issuer = appIssuer,
            Audience = appAudience,
            SigningCredentials = new SigningCredentials(appSecurityKey, SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}

