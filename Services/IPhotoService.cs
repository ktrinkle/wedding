using Azure.Storage.Blobs;
using Wedding.Models;

namespace wedding.Services;

public interface IPhotoService
{
    Task<BlobContainerClient?> GetConnectionAsync(string containerName);
    Task<string?> UploadFromStringAsync(BlobContainerClient containerClient, string fileName, byte[] attachmentData);
    Task<string?> UploadFileAsync(Stream fileStream, string fileName, string contentType);
    Task<List<PhotoListDto>> GetPreviewAsync();
    Task<byte[]?> GetPhotoBlobAsync(Guid photoGuid);;
}

