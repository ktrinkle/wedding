using Twilio;
using Twilio.AspNet.Common;
using Twilio.AspNet.Core;
using Twilio.TwiML;

namespace wedding.Controllers;

[ApiController]
[Route("[controller]")]
public class PhotoController : TwilioController
{
    private readonly ILogger<PhotoController> _logger;

    public PhotoController(ILogger<PhotoController> logger)
    {
        _logger = logger;
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
