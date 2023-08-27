namespace wedding.Services;

public interface IRsvpService
{
    Task<List<WeddingPartyMemberDto>?> SaveRsvpStatusSingleAsync(WeddingPartyUpdateDto updateDto);
    Task<List<WeddingPartyMemberDto>> GetWeddingPartyMembersAsync(string PartyGuid);
    Task<List<WeddingPartyMemberDto>> RemoveWeddingPartyMemberAsync(string PartyGuid, int groupMemberId);
}

