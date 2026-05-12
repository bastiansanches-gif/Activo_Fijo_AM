using Microsoft.AspNetCore.Mvc;

namespace Audiomusica.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SapSyncController : ControllerBase
{
    [HttpPost]
    public IActionResult Start() => Accepted();
}
