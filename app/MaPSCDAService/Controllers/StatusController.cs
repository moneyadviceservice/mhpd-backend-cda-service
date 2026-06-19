using MhpdCommon.Constants;
using MhpdCommon.Utils;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics.CodeAnalysis;

namespace MaPSCDAService.Controllers;

[Route(StatusConstants.ServiceRoute)]
[ApiController]
[ExcludeFromCodeCoverage]
public class StatusController(IServiceStatusProvider statusProvider) : ControllerBase
{
    [HttpGet]
    [Route(StatusConstants.Endpoint)]
    public async Task<IActionResult> Status()
    {
        return Ok(statusProvider.GetServiceStatus());
    }
}
