namespace wedding.Controllers;

[ApiController]
[Route("[controller]")]
public class RsvpController : ControllerBase
{

    private readonly ILogger<RsvpController> _logger;
    private readonly IRsvpService _rsvpService;

    public RsvpController(ILogger<RsvpController> logger, IRsvpService rsvpService)
    {
        _logger = logger;
        _rsvpService = rsvpService;
    }

    [Authorize]
    [HttpPost("saveRsvp")]
    public async Task<ActionResult<List<WeddingPartyMemberDto>>> SaveRsvpStatusSingleAsync(WeddingPartyMemberDto partyMember)
    {
        // we ignore the passed in group and use the one from the token

        var jwtGroupId = User.PartyGuid;

        if (jwtGroupId is null)
        {
            return Unauthorized();
        }

        var updateDto = new WeddingPartyUpdateDto()
        {
            GroupId = jwtGroupId.Invoke(),
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

    [Authorize]
    [HttpGet("getMembers")]
    public async Task<ActionResult<List<WeddingPartyMemberDto?>>> GetPartyGroupMembersAsync()
    {
        // we ignore the passed in group and use the one from the token

        var jwtGroupId = User.PartyGuid;

        if (jwtGroupId is null)
        {
            return Unauthorized();
        }

        var partyMemberDto = await _rsvpService.GetWeddingPartyMembersAsync(jwtGroupId.Invoke());

        return Ok(partyMemberDto);
    }

    [Authorize]
    [HttpPost("removeMember")]
    public async Task<ActionResult<List<WeddingPartyMemberDto?>>> RemovePartyGroupMemberAsync(WeddingPartyMemberDto partyMember)
    {
        // we ignore the passed in group and use the one from the token

        var jwtGroupId = User.PartyGuid;

        if (jwtGroupId is null)
        {
            return Unauthorized();
        }

        var partyMemberDto = await _rsvpService.RemoveWeddingPartyMemberAsync(jwtGroupId.Invoke(), partyMember.GroupMemberId);

        return Ok(partyMemberDto);
    }
}
