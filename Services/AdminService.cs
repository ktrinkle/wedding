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
                                    GroupId = w.GroupId,
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

    public async Task<List<WeddingPartyGiftDto>> GetGifts()
    {
        // returns wedding party gifts

        var weddingGifts =  await (from wg in _ContextWedding.WeddingGifts
                            join wp in _ContextWedding.WeddingGroupName
                            on wg.GroupId equals wp.GroupId
                            where wp.GroupMemberId == 1
                            select new WeddingPartyGiftDto() 
                            {
                                GroupId = wg.GroupId.ToString(),
                                FirstGroupMemberName = wp.GroupMemberName,
                                RsvpYes = wp.RsvpYes,
                                GiftComment = wg.GiftComment,
                                GiftAmount = wg.GiftAmount,
                                GiftDate = wg.GiftDate
                            }).ToListAsync();

        if (weddingGifts is null)
        {
            _logger.LogInformation("No gifts found");
            return new List<WeddingPartyGiftDto>();
        }
        
        return weddingGifts;
    }

    public async Task<List<WeddingPartyGiftDto>> UpdateGift(WeddingPartyGiftDto giftGiver)
    {
        // updates wedding party gifts 

        if (giftGiver.GroupId is null || giftGiver.GiftAmount <= 0)
        {
            return await GetGifts();
        }

        // check if gift already exists. If so, just update since the assumption is that we only get
        // one gift per party

        var giftInfo = await _ContextWedding.WeddingGifts
                            .FirstOrDefaultAsync(wg => wg.GroupId == new Guid(giftGiver.GroupId));

        if (giftInfo is not null)
        {
            giftInfo.GiftDate = giftGiver.GiftDate;
            giftInfo.GiftAmount = giftGiver.GiftAmount;
            giftInfo.GiftComment = giftGiver.GiftComment;

            _ContextWedding.Update(giftInfo);
        }

        if (giftInfo is null)
        {
            var newGiftEntry = new WeddingGifts()
            {
                GroupId = new Guid(giftGiver.GroupId),
                GiftComment = giftGiver.GiftComment,
                GiftAmount = giftGiver.GiftAmount,
                GiftDate = giftGiver.GiftDate
            };

            await _ContextWedding.AddAsync(newGiftEntry);
        }

        await _ContextWedding.SaveChangesAsync();
        
        return await GetGifts();
    }

}

