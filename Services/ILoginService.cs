namespace wedding.Services;

public interface ILoginService
{
    Task<BearerDto?> LoginAsync(string emailAddr, string password);
    Task<BearerDto?> LoginNoEmailAsync(string password);
    Task<BearerDto?> LoginDeepLinkAsync(string loginToken);
    Task<WeddingPartyDto?> GetPartyEmailAsync(string emailAddr);
    Task<WeddingPartyDto?> GetPartyAsync(string partyGuid);
    Task<string> GetAzureSASTokenAsync();
}

