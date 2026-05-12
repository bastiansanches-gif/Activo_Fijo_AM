using Microsoft.AspNetCore.Mvc;

namespace Audiomusica.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TrasladosController : ControllerBase
{
    [HttpGet]
    public IActionResult Get() => Ok(Array.Empty<object>());
}
