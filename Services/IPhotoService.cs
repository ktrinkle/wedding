using Azure.Storage.Blobs;

namespace wedding.Services;

public interface IPhotoService
{
    Task<BlobContainerClient?> GetConnectionAsync();
    Task<string?> UploadFromStringAsync(BlobContainerClient containerClient, string fileName, byte[] attachmentData);
}
