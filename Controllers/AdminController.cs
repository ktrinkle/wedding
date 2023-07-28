namespace wedding.Controllers;

[ApiController]
[Route("[controller]")]
public class AdminController : ControllerBase
{

    private readonly ILogger<AdminController> _logger;
    private readonly IAdminService _adminService;
    private readonly IRsvpService _rsvpService;

    public AdminController(ILogger<AdminController> logger, IAdminService adminService, IRsvpService rsvpService)
    {
        _logger = logger;
        _adminService = adminService;
        _rsvpService = rsvpService;
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("currentRsvp")]
    public async Task<ActionResult<List<WeddingPartyMemberDto>>> GetCurrentRsvp()
        => Ok(await _adminService.GetAllNames());

    [Authorize(Roles = "Admin")]
    [HttpPost("saveRsvp")]
    public async Task<ActionResult<List<WeddingPartyMemberDto>>> SaveRsvpStatusSingleAsync(WeddingPartyUpdateDto partyMember)
    {
        if (partyMember.GroupId is null)
        {
            return BadRequest();
        }

        var updateDto = new WeddingPartyUpdateDto()
        {
            GroupId = partyMember.GroupId,
            GroupMemberId = partyMember.GroupMemberId,
            GroupMemberName = partyMember.GroupMemberName,
            RsvpYes = partyMember.RsvpYes,
            RsvpComment = partyMember.RsvpComment,
            RsvpDrinkType = (int?)partyMember.RsvpDrinkType
        };

        var updatedDto = await _rsvpService.SaveRsvpStatusSingleAsync(updateDto);

        if (updatedDto is null)
        {
            return BadRequest();
        }

        return Ok(updatedDto);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("currentGifts")]
    public async Task<ActionResult<List<WeddingPartyGiftDto>>> GetGiftsAsync()
        => Ok(await _adminService.GetGifts());

    [Authorize(Roles = "Admin")]
    [HttpPost("saveGift")]
    public async Task<ActionResult<List<WeddingPartyGiftDto>>> SaveGiftAsync(WeddingPartyGiftDto giftUpdate)
    {
        if (giftUpdate.GroupId is null)
        {
            return BadRequest();
        }

        var updatedDto = await _adminService.UpdateGift(giftUpdate);

        if (updatedDto is null)
        {
            return BadRequest();
        }

        return Ok(updatedDto);
    }
    
}
