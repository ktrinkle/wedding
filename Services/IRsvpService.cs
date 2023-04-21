namespace wedding.Services;

public interface IRsvpService
{
    Task<WeddingPartyDto> SaveRsvpStatusSingleAsync(WeddingPartyUpdateDto updateDto);
    Task<List<WeddingPartyMemberDto>> GetWeddingPartyMembersAsync(string PartyGuid);
}

