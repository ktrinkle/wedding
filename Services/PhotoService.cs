using Azure;
using Azure.Storage;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using SkiaSharp;
using Wedding.Models;
using System;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace wedding.Services;

public class PhotoService : IPhotoService
{
    private readonly ContextWedding _ContextWedding;
    private readonly ILogger<AdminService> _logger;
    private readonly AppSettings _appSettings;

    const string PhotoBlob = "/photos";
    const string ThumbBlob = "/thumbs";

    public PhotoService(ILogger<AdminService> logger, IOptions<AppSettings> appSettings, ContextWedding context)
    {
        _logger = logger;
        _appSettings = appSettings.Value;
        _ContextWedding = context;
    }

    public async Task<BlobContainerClient> GetConnectionAsync(string containerName)
    {
        // Note: The container is to be included in the serviceUri in AppSettings.json.

        var serviceUri = new Uri(_appSettings.AzureStorage.AccountUrl! + containerName);
        var sharedKeyCredential = new StorageSharedKeyCredential(_appSettings.AzureStorage.AccountName!, 
            _appSettings.AzureStorage.AccountKey);

        try
        {
            var service = new BlobContainerClient(serviceUri, sharedKeyCredential);
            return service;   
        }
        catch
        {
            _logger.LogCritical("Unable to connect to blob container.");
            return new BlobContainerClient(null);
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

    public async Task<string?> UploadFileAsync(Stream fileStream, string fileName, string contentType)
    {
        var containerClient = await GetConnectionAsync(PhotoBlob);

        // swap to Guid to abstract file names
        var fileGuid = Guid.NewGuid();
            
        var fileSuffix = contentType switch {
            "image/jpeg"  => ".jpg",
            "image/png" => ".png",
            "image/heic" => ".heic",
            _ => ""
        };

        BlobClient blobClient = containerClient.GetBlobClient(fileGuid.ToString() + fileSuffix);

        await blobClient.DeleteIfExistsAsync(DeleteSnapshotsOption.IncludeSnapshots);
        await blobClient.UploadAsync(fileStream, new BlobHttpHeaders { ContentType = contentType });

        // reset filestream for the thumbnail
        fileStream.Position = 0;
        GenerateThumbnail(fileStream, fileGuid, contentType);

        return blobClient.Uri.ToString();
    }

    private async void GenerateThumbnail(Stream fileStream, Guid fileGuid, string contentType)
    {
        var containerClient = await GetConnectionAsync(ThumbBlob);

        BlobClient blobClient = containerClient.GetBlobClient(fileGuid.ToString() + contentType);

        // code from Ben Abt here since the SK docs are lacking, slightly modified
        using (SKBitmap image = SKBitmap.Decode(fileStream))
        {
            var divisor = image.Width / 150;
            var height = Convert.ToInt32(Math.Round((decimal)(image.Height / divisor)));

            using SKBitmap scaledBitmap = image.Resize(new SKImageInfo(150, height), SKFilterQuality.Medium);
            using SKImage scaledImage = SKImage.FromBitmap(scaledBitmap);
            using SKData outputThumb = scaledImage.Encode();
            {
                await blobClient.DeleteIfExistsAsync(DeleteSnapshotsOption.IncludeSnapshots);
                await blobClient.UploadAsync(outputThumb.AsStream());
            }
        }
    }

    public async Task<List<PhotoListDto>> GetPreviewAsync()
    {
        var containerClient = await GetConnectionAsync(ThumbBlob);

        try
        {
            var containerList = containerClient.GetBlobsAsync().AsPages(default, null);
            var returnList = new List<PhotoListDto>();

            await foreach (Page<BlobItem> blobPage in containerList)
            {
                foreach (BlobItem blobItem in blobPage.Values)
                {
                    byte[] tempImage;
                    BlobClient blobClient = containerClient.GetBlobClient(blobItem.Name);
                    using (var imageStream = await blobClient.OpenReadAsync())
                    {
                        tempImage = new byte[imageStream.Length];
                        await imageStream.ReadAsync(tempImage.AsMemory(0, (int)tempImage.Length));
                    }

                    returnList.Add(new PhotoListDto()
                    {
                        PhotoGuid = new Guid(blobItem.Name.Split('.')[0]),
                        PhotoPreview = tempImage,
                        PhotoType = blobItem.Name.Split('.')[1]
                    });
                }
            }

            return returnList;
        }
        catch (Exception ex)
        {
            _logger.LogCritical(ex.ToString());
            return new List<PhotoListDto>();
        }
    }

    public async Task<byte[]?> GetPhotoBlobAsync(Guid photoGuid, string photoType)
    {
        var containerClient = await GetConnectionAsync(PhotoBlob);
        byte[] tempImage;

        if (!(photoType == "jpg" || photoType == "heic" || photoType == "png"))
        {
            return null;
        }

        try
        {   
            BlobClient blobClient = containerClient.GetBlobClient(photoGuid.ToString() + "." + photoType);

            using (var imageStream = await blobClient.OpenReadAsync())
            {
                tempImage = new byte[imageStream.Length];
                await imageStream.ReadAsync(tempImage.AsMemory(0, (int)tempImage.Length));
            }

            return tempImage;
        }
        catch (Exception ex)
        {
            _logger.LogCritical(ex.ToString());
            return null;
        }

    }

    // add method here for getting actual blob

    #region TwilioApi


    #endregion
    
}

