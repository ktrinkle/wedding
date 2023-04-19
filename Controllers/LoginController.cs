namespace wedding.Controllers;

[ApiController]
[Route("[controller]")]
public class LoginController : ControllerBase
{

    private readonly ILogger<LoginController> _logger;
    private readonly ILoginService _loginService;

    public LoginController(ILogger<LoginController> logger, ILoginService loginService)
    {
        _logger = logger;
        _loginService = loginService;
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<WeddingPartyDto>> Login(LoginDto loginDto)
    {
        if (loginDto.EmailAddress is null)
        {
            return Unauthorized();
        }

        if (loginDto.Password is null or "")
        {
            return Unauthorized();
        }

        var loginResult = await _loginService.LoginAsync(loginDto.EmailAddress, loginDto.Password);

        if (loginResult is null)
        {
            return Unauthorized();
        }

        return Ok(loginResult);
    }

    [AllowAnonymous]
    [HttpPost("adminLogin")]
    public async Task<ActionResult<WeddingPartyDto>> AdminLogin(string emailAddr, string password)
    {
        if (emailAddr is null)
        {
            return Unauthorized();
        }

        var loginResult = await _loginService.LoginAdminAsync(emailAddr, password);

        if (loginResult is null)
        {
            return Unauthorized();
        }

        return Ok(loginResult);
    }

    [Authorize]
    [HttpGet("partyByEmail")]
    public async Task<ActionResult<WeddingPartyDto>> GetPartyByEmail(string emailAddr)
    {
        if (emailAddr is null)
        {
            return Unauthorized();
        }

        var partyResult = await _loginService.GetPartyEmailAsync(emailAddr);

        if (partyResult is null)
        {
            return Unauthorized();
        }

        return Ok(partyResult);
    }

    [Authorize]
    [HttpGet("party")]
    public async Task<ActionResult<WeddingPartyDto>> GetParty(string partyGuid)
    {
        if (partyGuid is null)
        {
            return Unauthorized();
        }

        var partyResult = await _loginService.GetPartyAsync(partyGuid);

        if (partyResult is null)
        {
            return Unauthorized();
        }

        return Ok(partyResult);
    }

    [Authorize]
    [HttpGet("partyByAuth")]
    public async Task<ActionResult<WeddingPartyDto>> GetPartyByAuth()
    {
        var partyGuid = User.PartyGuid;
        
        if (partyGuid is null)
        {
            return Unauthorized();
        }

        var partyResult = await _loginService.GetPartyAsync(partyGuid.Invoke());

        if (partyResult is null)
        {
            return Unauthorized();
        }

        return Ok(partyResult);
    }

}
