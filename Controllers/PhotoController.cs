using System.Net.Http.Headers;
using Twilio;
using Twilio.AspNet.Common;
using Twilio.AspNet.Core;
using Twilio.TwiML;
using Wedding.Models;

namespace wedding.Controllers;

[ApiController]
[Route("[controller]")]
public class PhotoController : TwilioController
{
    private readonly ILogger<PhotoController> _logger;
    private readonly IPhotoService _photoService;

    public string[] ContentTypes = {"image/jpeg", "image/png", "image/heic", "image/tiff", "video/mp4"}; 

    public PhotoController(ILogger<PhotoController> logger, IPhotoService photoService)
    {
        _logger = logger;
        _photoService = photoService;
    }

    [DisableRequestSizeLimit]
    [Authorize]
    [HttpPost("uploadPhotoFile")]
    public async Task<IActionResult> UploadAsync()
    {
        try
        {                
            var formCollection = await Request.ReadFormAsync();
            var file = formCollection.Files.First();
            if (file.Length > 0 && ContentTypes.Contains(file.ContentType))
            {
                var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName!.Trim('"');
                string fileURL = await _photoService.UploadFileAsync(file.OpenReadStream(), fileName, file.ContentType);
                return Ok(new { fileURL });
            }
            else
            {
                return BadRequest();
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex}");
        }
    }

    [Authorize]
    [HttpGet("getThumbnails")]
    public Task<List<PhotoListDto>> GetThumbnailsAsync()
        => _photoService.GetPreviewAsync();

    [Authorize]
    [HttpGet("full/{photoType}/{photoGuid}")]
    public Task<byte[]?> GetPhotoAsync(Guid photoGuid, string photoType)
        => _photoService.GetPhotoBlobAsync(photoGuid, photoType);


    [Authorize(Roles = "Twilio")]
    [HttpPost("savePhoto")]
    public TwiMLResult Index(SmsRequest incomingMessage)
    {
        var messagingResponse = new MessagingResponse();
        messagingResponse.Message("The copy cat says: " +
                                    incomingMessage.Body);

        return TwiML(messagingResponse);
    }
    
}
