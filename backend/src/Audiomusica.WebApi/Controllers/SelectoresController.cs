using Microsoft.AspNetCore.Mvc;

namespace Audiomusica.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SelectoresController : ControllerBase
{
    [HttpGet]
    public IActionResult Get() => Ok(Array.Empty<object>());
}
