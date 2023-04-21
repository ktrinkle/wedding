namespace wedding.Services;

public class RsvpService : IRsvpService
{
    private readonly ContextWedding _ContextWedding;
    private readonly ILogger<RsvpService> _logger;
    private readonly AppSettings _appSettings;
    private readonly ILoginService _loginService;

    public RsvpService(ILogger<RsvpService> logger, ContextWedding context, 
                        IOptions<AppSettings> appSettings, ILoginService loginService)
    {
        _logger = logger;
        _ContextWedding = context;
        _appSettings = appSettings.Value;
        _loginService = loginService;
    }

    public async Task<WeddingPartyDto> SaveRsvpStatusSingleAsync(WeddingPartyUpdateDto updateDto)
    {
        /*
        Update an RSVP status for a single person.
        Called dynamically as check boxes are performed.
        */
        
        var userInfo = await _ContextWedding.WeddingGroupName.FirstOrDefaultAsync(u => u.GroupId == new Guid(updateDto.GroupId)
                                && u.GroupMemberId == updateDto.GroupMemberId);

        if (userInfo is null)
        {
            return null;
        }

        userInfo.GroupMemberName = updateDto.GroupMemberName;
        userInfo.RsvpComment = updateDto.RsvpComment;
        userInfo.RsvpYes = updateDto.RsvpYes;

        _ContextWedding.WeddingGroupName.Update(userInfo);
        await _ContextWedding.SaveChangesAsync();

        var partyInfo = await _loginService.GetPartyAsync(updateDto.GroupId);

        return partyInfo;
    }

    public async Task<List<WeddingPartyMemberDto>> GetWeddingPartyMembersAsync(string PartyGuid)
    {
        if (PartyGuid is null)
        {
            return new List<WeddingPartyMemberDto>() {};
        }
    

        var partyList = await _ContextWedding.WeddingGroupName.Where(g => g.GroupId == new Guid(PartyGuid))
                            .Select(g => new WeddingPartyMemberDto() {
                                GroupMemberId = g.GroupMemberId,
                                GroupMemberName = g.GroupMemberName,
                                RsvpComment = g.RsvpComment,
                                RsvpYes = g.RsvpYes
                            }).ToListAsync();

        return partyList;
    }

}

