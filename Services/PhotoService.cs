using Azure.Storage;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Sas;

namespace wedding.Services;

public class PhotoService : IPhotoService
{
    private readonly ContextWedding _ContextWedding;
    private readonly ILogger<AdminService> _logger;
    private readonly AppSettings _appSettings;

    public PhotoService(ILogger<AdminService> logger, IOptions<AppSettings> appSettings, ContextWedding context)
    {
        _logger = logger;
        _appSettings = appSettings.Value;
        _ContextWedding = context;
    }

    public async Task<BlobContainerClient?> GetConnectionAsync()
    {
        // Note: The container is to be included in the serviceUri in AppSettings.json.
        var accountName = _appSettings.AzureStorage.AccountName;
        var accountKey = _appSettings.AzureStorage.AccountKey;
        var serviceUri = new Uri(_appSettings.AzureStorage.AccountUrl!);

        if (accountName is null)
        {
            _logger.LogError("Blob storage configuration is not set properly");
            return null;
        }

        try
        {
            var credential = new StorageSharedKeyCredential(accountName, accountKey);
            var service = new BlobContainerClient(serviceUri, credential);
            return service;   
        }
        catch
        {
            _logger.LogCritical("Unable to connect to blob container.");
            return null;
        }
    }

    public async Task<string?> UploadFromStringAsync(BlobContainerClient containerClient, string fileName, byte[] attachmentData)
    {
        BlobClient blobClient = containerClient.GetBlobClient(fileName);

        try
        {
            var memoryStream = new MemoryStream(attachmentData);
            await blobClient.UploadAsync(memoryStream, true);
            memoryStream.Close();
            return "Congratulations! We have your file!";
        }
        catch (Exception ex)
        {
            _logger.LogCritical(ex.ToString());
            return "I'm sorry, an error happened.";
        }
    }

    #region TwilioApi


    #endregion
    
}
