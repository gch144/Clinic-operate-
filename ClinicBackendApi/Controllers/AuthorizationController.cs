
using ClinicBackendApi.Repositories.Abstract;
using ClinicBackendApi.Models.DTO;
using Microsoft.AspNetCore.Mvc;
using ClinicBackendApi.Models;
using Microsoft.AspNetCore.Authorization;


namespace ClinicBackendApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly IUserAuthenticationService _authService;
        private readonly ILogger<AuthenticationController> _logger;

        public AuthenticationController(IUserAuthenticationService authService, ILogger<AuthenticationController> logger)
        {
            _authService = authService;
            _logger = logger;
        }


        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login(LoginModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid payload");

                Status status = await _authService.Login(model);

                if (status.StatusCode == 0)
                    return BadRequest(status.Message);

                return Ok(status);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }


        //     [HttpPost]
        //     [Route("registerationAdmin")]
        //     public async Task<IActionResult> Register(RegistrationModel model)
        //     {
        //         try
        //         {
        //             if (!ModelState.IsValid)
        //                 return BadRequest("Invalid payload");
        //             var (status, message) = await _authService.Registeration(model, UserRoles.Admin);
        //             if (status == 0)
        //             {
        //                 return BadRequest(message);
        //             }
        //             return CreatedAtAction(nameof(Register), model);

        //         }
        //         catch (Exception ex)
        //         {
        //             _logger.LogError(ex.Message);
        //             return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
        //         }
        //     }
        // }
        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register(RegistrationModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid payload");

                Status status = await _authService.Registeration(model, UserRoles.Patient);

                if (status.StatusCode == 0)
                {
                    return BadRequest(status.Message);
                }

                return CreatedAtAction(nameof(Register), model);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
        // [Authorize]
        // [HttpGet]
        // [Route("logout")]
        // public async Task<IActionResult> Logout()
        // {

        //     try
        //     {
        //         if (!ModelState.IsValid)
        //             return BadRequest("Invalid payload");

        //         Status status = await _authService.Logout();

        //         if (status.StatusCode == 0)
        //             return BadRequest(status.Message);

        //         return Ok(status.Message);
        //     }
        //     catch (Exception ex)
        //     {
        //         _logger.LogError(ex.Message);
        //         return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
        //     }
        // }
        [HttpPost]
        [Route("changepassword")]
        public async Task<IActionResult> ChangePassword(ChangePasswordModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid payload");

                Status status = await _authService.ChangePassword(model);

                if (status.StatusCode == 0)
                {
                    return BadRequest(status.Message);
                }

                return Ok(status.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
    }
}