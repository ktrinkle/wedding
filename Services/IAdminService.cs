namespace wedding.Services;

public interface IAdminService
{
    Task<List<WeddingPartyMemberDto>> GetAllNames();
    Task<List<WeddingPartyGiftDto>> GetGifts();
    Task<List<WeddingPartyGiftDto>> UpdateGift(WeddingPartyGiftDto giftGiver);
}

