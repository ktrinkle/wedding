namespace wedding.Services;

public class AdminService : IAdminService
{
    private readonly ContextWedding _ContextWedding;
    private readonly ILogger<AdminService> _logger;

    public AdminService(ILogger<AdminService> logger, ContextWedding context)
    {
        _logger = logger;
        _ContextWedding = context;
    }

    public async Task<List<WeddingPartyMemberDto>> GetAllNames()
    {
        /*
        Gets full list of party members based on status.
        */

        var weddingPartyList = await _ContextWedding.WeddingGroupName
                                .Select(w => new WeddingPartyMemberDto() {
                                    GroupMemberId = w.GroupMemberId,
                                    GroupMemberName = w.GroupMemberName,
                                    RsvpYes = w.RsvpYes,
                                    RsvpComment = w.RsvpComment,
                                    RsvpDrinkType = w.DrinkTypeCd
                                }).ToListAsync();

        if (weddingPartyList is null)
        {
            _logger.LogInformation("No RSVPs found");
            return new List<WeddingPartyMemberDto>();
        }
        
        return weddingPartyList;
    }

}

