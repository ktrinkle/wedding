namespace wedding.Services;

public interface ILoginService
{
    Task<BearerDto?> LoginAsync(string emailAddr, string password);
    Task<BearerDto?> LoginNoEmailAsync(string password);
    Task<BearerDto?> LoginDeepLinkAsync(string loginToken);
    Task<WeddingPartyDto?> GetPartyEmailAsync(string userName);
    Task<WeddingPartyDto?> GetPartyAsync(string userName);
    Task<string> GetAzureSASTokenAsync();
}

