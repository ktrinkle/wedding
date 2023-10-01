using Azure;
using Azure.Storage;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
//using SkiaSharp;
using ImageMagick;
using Wedding.Models;

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
            "image/gif" => ".gif",
            _ => ""
        };

        BlobClient blobClient = containerClient.GetBlobClient(fileGuid.ToString() + fileSuffix);

        await blobClient.DeleteIfExistsAsync(DeleteSnapshotsOption.IncludeSnapshots);
        await blobClient.UploadAsync(fileStream, new BlobHttpHeaders { ContentType = contentType });

        _logger.LogInformation("Uploaded stream {}", fileGuid.ToString());
        // reset filestream for the thumbnail
        fileStream.Position = 0;
        _logger.LogInformation("Starting thumbnail process");
        await GenerateThumbnail(fileStream, fileGuid, fileSuffix);

        return blobClient.Uri.ToString();
    }

    private async Task GenerateThumbnail(Stream fileStream, Guid fileGuid, string contentType)
    {
        _logger.LogInformation("Start GenerateThumbnail");
        var containerClient = await GetConnectionAsync(ThumbBlob);

        BlobClient blobClient = containerClient.GetBlobClient(fileGuid.ToString() + contentType);

        _logger.LogInformation("start imageMagick");
        _logger.LogInformation(blobClient.Name.ToString());
        // originally this was SkiaSharp but that does not support HEIC in .NET

        var imageType = contentType switch {
            ".jpg"  => MagickFormat.Jpeg,
            ".png" => MagickFormat.Png,
            ".heic" => MagickFormat.Heic,
            ".gif" => MagickFormat.Gif,
            _ => MagickFormat.Raw
        };

        var imageSettings = new MagickReadSettings { Format = imageType };
        using var image = new MagickImage(fileStream, imageSettings);
        var divisor = image.Height / 100;
        var width = Convert.ToInt32(Math.Round((decimal)(image.Width / divisor)));

        _logger.LogInformation("divisor generated, new size {divisor} x {width}", divisor, width);

        var size = new MagickGeometry(width, 100)
        {
            // the calcs handle this, but being safe by keeping aspect ratio
            IgnoreAspectRatio = false
        };
        image.Resize(size);

        _logger.LogInformation("write to new stream");
        try 
        {
            byte[] data = image.ToByteArray(imageType);

            using MemoryStream memStream = new(data);
            // ImageMagick.MagickMissingDelegateErrorException
            // await image.WriteAsync(memStream);
            memStream.Position = 0;
            _logger.LogInformation("encode complete, uploading blob");

            await blobClient.DeleteIfExistsAsync(DeleteSnapshotsOption.IncludeSnapshots);
            await blobClient.UploadAsync(memStream);
        }
        catch(Exception ex)
        {
            _logger.LogError(ex, "An exception happened");
        }
        // convert to byte and skip writeasync
        
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

        if (!(photoType == "jpg" || photoType == "heic" || photoType == "png"))
        {
            return null;
        }

        try
        {   
            BlobClient blobClient = containerClient.GetBlobClient(photoGuid.ToString() + "." + photoType);

            using var imageStream = await blobClient.OpenReadAsync();
            imageStream.Position = 0;
            return imageStream;
        }
        catch (Exception ex)
        {
            _logger.LogCritical(ex.ToString());
            return null;
        }

    }
    
}

