using System.Net.Http.Headers;
using Twilio;
using Twilio.AspNet.Common;
using Twilio.AspNet.Core;
using Twilio.TwiML;
using wedding.Extensions;
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
            var file = formCollection.Files[0];
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
    public async Task<List<PhotoListDto>> GetThumbnailsAsync()
        => await _photoService.GetPreviewAsync();


    // public async Task<IActionResult> GetPhotoAsync(Guid photoGuid, string photoType)
    // {
    //     var photoReturn = await _photoService.GetPhotoBlobAsync(photoGuid, photoType);

    //     if (photoReturn is null)
    //     {
    //         return NotFound();
    //     }

    //     return Ok(File(photoReturn.Photo!, photoReturn.ContentType!, photoReturn.PhotoName));
    // }

    [Authorize]
    [HttpGet("full/{photoType}/{photoGuid}")]
    public async Task<ActionResult<FileStreamResult>?> GetPhotoAsyncTemp(Guid photoGuid, string photoType)
    {
        var photoReturn = await _photoService.GetPhotoBlobAsync(photoGuid, photoType);

        if (photoReturn is null)
        {
            return BadRequest();
        }

        return Ok(new FileStreamResult(photoReturn, "image/" + photoType));
    }

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
