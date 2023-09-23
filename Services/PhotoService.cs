using Azure;
using Azure.Storage;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using SkiaSharp;
using Wedding.Models;
using System;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;

namespace wedding.Services;

public class PhotoService : IPhotoService
{
    private readonly ContextWedding _ContextWedding;
    private readonly ILogger<PhotoService> _logger;
    private readonly AppSettings _appSettings;

    const string PhotoBlob = "/photos";
    const string ThumbBlob = "/thumbs";

    public PhotoService(ILogger<PhotoService> logger, IOptions<AppSettings> appSettings, ContextWedding context)
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

        _logger.LogInformation("Uploaded stream {}", fileGuid.ToString());
        // reset filestream for the thumbnail
        // temporary disable
        fileStream.Position = 0;
        _logger.LogInformation("Starting thumbnail process");
        await GenerateThumbnail(fileStream, fileGuid, fileSuffix);

        return blobClient.Uri.ToString();
    }

    private async Task GenerateThumbnail(Stream fileStream, Guid fileGuid, string contentType)
    {
        _logger.LogCritical("Start GenerateThumbnail");
        var containerClient = await GetConnectionAsync(ThumbBlob);

        BlobClient blobClient = containerClient.GetBlobClient(fileGuid.ToString() + contentType);

        _logger.LogInformation("start SKbitmap");
        _logger.LogInformation(blobClient.Name.ToString());
        // code from Ben Abt here since the SK docs are lacking, slightly modified
        using (SKBitmap image = SKBitmap.Decode(fileStream))
        {
            var divisor = image.Width / 150;
            var height = Convert.ToInt32(Math.Round((decimal)(image.Height / divisor)));

            _logger.LogInformation("divisor generated");
            using SKBitmap scaledBitmap = image.Resize(new SKImageInfo(150, height), SKFilterQuality.Medium);
            using SKImage scaledImage = SKImage.FromBitmap(scaledBitmap);
            using SKData outputThumb = scaledImage.Encode();
            {
                _logger.LogInformation("encode complete, uploading blob");
                await blobClient.DeleteIfExistsAsync(DeleteSnapshotsOption.IncludeSnapshots);
                await blobClient.UploadAsync(outputThumb.AsStream());
            }
        }

        // IImageFormat format;

        // using (Image<Rgba32> input = Image.Load<Rgba32>(fileStream, out format))
        // {
        //     Stream? imageSmall = null;
        //     ResizeImage(input, imageSmall, format);
        //     _logger.LogInformation("resize complete");
        //     var returnByte = Array.Empty<byte>();
        //     await blobClient.DeleteIfExistsAsync(DeleteSnapshotsOption.IncludeSnapshots);
        //     await blobClient.UploadAsync(imageSmall);
        // }
    }

    public static void ResizeImage(Image<Rgba32> input, Stream? output, IImageFormat format)
    {
        var divisor = input.Height / 100;
        var width = Convert.ToInt32(Math.Round((decimal)(input.Width / divisor)));
        
        var xSize = 100;

        input.Mutate(x => x.Resize(xSize, width));
        input.Save(output, format);
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

    public async Task<Stream?> GetPhotoBlobAsync(Guid photoGuid, string photoType)
    {
        var containerClient = await GetConnectionAsync(PhotoBlob);
        // byte[] tempImage;

        if (!(photoType == "jpg" || photoType == "heic" || photoType == "png"))
        {
            return null;
        }

        try
        {   
            BlobClient blobClient = containerClient.GetBlobClient(photoGuid.ToString() + "." + photoType);

            using (var imageStream = await blobClient.OpenReadAsync())
            {
                imageStream.Position = 0;
                return imageStream;
                // tempImage = new byte[imageStream.Length];
                // await imageStream.ReadAsync(tempImage.AsMemory(0, (int)tempImage.Length));
            }
        }
        catch (Exception ex)
        {
            _logger.LogCritical(ex.ToString());
            return null;
        }

    }

    #region TwilioApi


    #endregion
    
}

