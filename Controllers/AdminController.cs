namespace wedding.Controllers;

[ApiController]
[Route("[controller]")]
public class AdminController : ControllerBase
{

    private readonly ILogger<AdminController> _logger;
    private readonly IAdminService _adminService;

    public AdminController(ILogger<AdminController> logger, IAdminService adminService)
    {
        _logger = logger;
        _adminService = adminService;
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("currentRsvp")]
    public async Task<ActionResult<List<WeddingPartyMemberDto>>> GetCurrentRsvp()
    {
        // This will return the full list and we filter in the UI.

        var rsvpList = await _adminService.GetAllNames();

        return Ok(rsvpList);
    }

}
