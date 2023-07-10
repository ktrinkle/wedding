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

    public async Task<List<WeddingPartyMemberDto>?> SaveRsvpStatusSingleAsync(WeddingPartyUpdateDto updateDto)
    {
        /*
        Update an RSVP status for a single person.
        Called dynamically as check boxes are performed.
        */

        // verify that wedding group exists
        var weddingGroup = await _ContextWedding.WeddingGroup.FirstOrDefaultAsync(u => u.GroupId == new Guid(updateDto.GroupId));

        if (weddingGroup is null)
        {
            _logger.LogInformation("Invalid wedding group called - {}", updateDto.GroupId);
            return null;
        }
        
        var userInfo = await _ContextWedding.WeddingGroupName.FirstOrDefaultAsync(u => u.GroupId == new Guid(updateDto.GroupId)
                                && u.GroupMemberId == updateDto.GroupMemberId);

        // our way of upserting. If the group member ID doesn't exist, add it.
        if (userInfo is null)
        {
            // create a new object and save it. Then 
            var newUser = new WeddingGroupName() {
                GroupId = weddingGroup.GroupId,
                GroupMemberId = updateDto.GroupMemberId, // set in the UI
                GroupMemberName = updateDto.GroupMemberName,
                RsvpComment = updateDto.RsvpComment,
                RsvpYes = updateDto.RsvpYes,
                DrinkTypeCd = updateDto.RsvpDrinkType
            };
            await _ContextWedding.WeddingGroupName.AddAsync(newUser);
        }
        else
        {
            userInfo.GroupMemberName = updateDto.GroupMemberName;
            userInfo.RsvpComment = updateDto.RsvpComment;
            userInfo.RsvpYes = updateDto.RsvpYes;
            userInfo.DrinkTypeCd = updateDto.RsvpDrinkType;

            _ContextWedding.WeddingGroupName.Update(userInfo);
        }

        await _ContextWedding.SaveChangesAsync();

        var partyInfo = await GetWeddingPartyMembersAsync(updateDto.GroupId);

        return partyInfo;
    }

    public async Task<List<WeddingPartyMemberDto>> RemoveWeddingPartyMemberAsync(string partyGuid, int groupMemberId)
    {
        if (partyGuid is null)
        {
            return new List<WeddingPartyMemberDto>() {};
        }

        var userInfo = await _ContextWedding.WeddingGroupName.FirstOrDefaultAsync(u => u.GroupId == new Guid(partyGuid)
                                && u.GroupMemberId == groupMemberId);

        if (userInfo is not null)
        {
            _ContextWedding.Remove(userInfo);
            await _ContextWedding.SaveChangesAsync();
        }

        // renumber the remaining members
        var remainingParty = await _ContextWedding.WeddingGroupName.Where(u => u.GroupId == new Guid(partyGuid)
                                && u.GroupMemberId > groupMemberId).ToListAsync();

        if (remainingParty is not null)
        {
            _ContextWedding.RemoveRange(remainingParty);
            await _ContextWedding.SaveChangesAsync();
            
            var nextPerson = groupMemberId;

            foreach(var remainingMember in remainingParty)
            {
                remainingMember.GroupMemberId = nextPerson;
                nextPerson++;
            }

            await _ContextWedding.AddRangeAsync(remainingParty);
            await _ContextWedding.SaveChangesAsync();
            
        }

        return await GetWeddingPartyMembersAsync(partyGuid);
    }

    public async Task<List<WeddingPartyMemberDto>> GetWeddingPartyMembersAsync(string PartyGuid)
    {
        if (PartyGuid is null)
        {
            return new List<WeddingPartyMemberDto>() {};
        }
    
        var partyList = await _ContextWedding.WeddingGroupName.Where(g => g.GroupId == new Guid(PartyGuid))
                            .OrderBy(g => g.GroupMemberId)
                            .Select(g => new WeddingPartyMemberDto() {
                                GroupMemberId = g.GroupMemberId,
                                GroupMemberName = g.GroupMemberName,
                                RsvpComment = g.RsvpComment,
                                RsvpYes = g.RsvpYes,
                                RsvpDrinkType = g.DrinkTypeCd
                            }).ToListAsync();

        return partyList;
    }

}

