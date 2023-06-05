namespace wedding.Services;

public interface IAdminService
{
    Task<List<WeddingPartyMemberDto>> GetAllNames();
}

