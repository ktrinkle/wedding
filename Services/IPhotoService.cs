using Azure.Storage.Blobs;

namespace wedding.Services;

public interface IPhotoService
{
    public Task<BlobServiceClient?> GetConnectionAsync();
}

