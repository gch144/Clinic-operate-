using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ClinicBackendApi.Models.DTO;

namespace ClinicBackendApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ProtectedController : ControllerBase
    {
        [HttpGet]
        [Route("GetData")]
        public IActionResult GetData()
        {
            var status = new Status();
            status.StatusCode = 1;
            status.Message = "Data from protected controller";
            return Ok(status);
        }
        [HttpGet]
        [Route("test")]
        [AllowAnonymous]
        public async Task<IActionResult> Test()
        {
            var fruits = await Task.FromResult(new string[] { "apple", "bananana", "kiwi" });
            return Ok(fruits);
        }
    }
}