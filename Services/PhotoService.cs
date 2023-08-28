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

    public async Task<BlobServiceClient?> GetConnectionAsync()
    {
        var accountName = _appSettings.AzureStorage.AccountName;
        var accountKey = _appSettings.AzureStorage.AccountKey;
        var serviceUri = new Uri(_appSettings.AzureStorage.AccountUrl!);

        if (accountName is null)
        {
            _logger.LogError("Blob storage configuration is not set properly");
            return null;
        }

        var credential = new StorageSharedKeyCredential(accountName, accountKey);
        var service = new BlobServiceClient(serviceUri, credential);
        return service;        
    }

    public static async Task UploadFromStringAsync(
        BlobContainerClient containerClient,
        string blobName,
        )
    {
        BlobClient blobClient = containerClient.GetBlobClient(blobName);
        string blobContents = "Sample blob data";

        await blobClient.UploadAsync(BinaryData.FromString(blobContents), overwrite: true);
    }

    
}

