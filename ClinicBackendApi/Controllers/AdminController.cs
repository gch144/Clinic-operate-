using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ClinicBackendApi.Models.DTO;
using ClinicBackendApi.Repositories.Abstract;
using ClinicBackendApi.Models.Domain;
using Microsoft.AspNetCore.Identity;
using ClinicBackendApi.Models;
using System.Globalization;

namespace ClinicBackendApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = UserRoles.Admin)]
    public class AdminController : ControllerBase
    {
        private readonly IUserAuthenticationService _authService;
        private readonly DatabaseContext _context;
        private readonly UserManager<ApplicationUser> userManager;
        private readonly ILogger<AdminController> _logger;

        public AdminController(UserManager<ApplicationUser> userManager, IUserAuthenticationService authService, ILogger<AdminController> logger, DatabaseContext context)
        {
            this.userManager = userManager;
            _context = context;
            _authService = authService;
            _logger = logger;
        }
        [HttpGet]
        [Route("GetData")]
        public IActionResult GetData()
        {
            var status = new Status();
            status.StatusCode = 1;
            status.Message = "Data from admin controller";
            return Ok(status);
        }
        [HttpPost]
        [Route("registerDOC")]
        public async Task<IActionResult> Register(RegistrationDoctorModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest("Invalid payload");

                Status status = await _authService.RegisterationDoctor(model, UserRoles.Doctor);

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

        [HttpGet]
        [Route("GetUnverifiedUsers")]
        public IActionResult GetUnverifiedUsers()
        {
            try
            {
                var unverifiedUsers = _context.Users
                    .Where(a => !a.IsVerified)
                    .AsEnumerable()  // Switch to client-side processing
                    .Where(a => userManager.GetRolesAsync(a).Result.Contains(UserRoles.Patient))
                    .Select(a => new PatientDTO { PatientId = a.Id, Name = a.Name, IsVerified = a.IsVerified })
                    .ToList();

                return Ok(new Status { StatusCode = 1, Message = "List of unverified Users", PatientUsers = unverifiedUsers });
            }
            catch (Exception ex)
            {
                // Log the exception or handle it as needed
                return StatusCode(StatusCodes.Status500InternalServerError, new Status { StatusCode = 0, Message = "Error retrieving Patient." });
            }
        }


        private async Task VerifyUserAsync(string userId)
        {
            var user = await userManager.FindByIdAsync(userId);
            //Console.WriteLine("Unverfieied" + user.);

            if (user != null)
            {
                user.IsVerified = true;

                // Update the notification status if applicable
                if (user.Notification != null)
                {
                    user.Notification.IsNotified = true;
                }
                await userManager.UpdateSecurityStampAsync(user);
                await userManager.UpdateAsync(user);
            }
            else
            {
                throw new Exception("User not found");

            }
        }
        [HttpPost]
        [Route("VerifyUser/{userId}")]
        public async Task<IActionResult> VerifyUser(string userId)
        {
            try
            {
                await VerifyUserAsync(userId);
                return Ok(new Status { StatusCode = 1, Message = "User verified successfully." });
            }
            catch (Exception ex)
            {
                // Log the exception or handle it as needed
                return StatusCode(StatusCodes.Status500InternalServerError, new Status { StatusCode = 0, Message = "Error verifying user." });
            }
        }



        [HttpGet]
        [Route("ListAllDoctors")]
        public IActionResult ListAllDoctors()
        {
            try
            {
                var doctors = _context.Users
                    .Where(u => u.Specialty_Doc != DoctorSpecialty.None)
                    .ToList();

                if (doctors.Count == 0)
                {
                    return NotFound("No doctors found.");
                }
                var doctorList = doctors.Select(doctor => new DoctorDTO
                {
                    DoctorId = doctor.Id,
                    Name = doctor.Name,
                    Specialization = doctor.Specialty_Doc.ToString(),
                    // IsVerified = doctor.IsVerified
                }).ToList();

                return Ok(new Status { StatusCode = 1, Message = "List of all doctors", DoctorUsers = doctorList });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new Status { StatusCode = 0, Message = "Error retrieving doctors." });
            }
        }

        [HttpPost]
        [Route("Createdoctorschedules")]
        public IActionResult CreateDoctorSchedule([FromBody] CreateDoctorScheduleDTO doctorSchedule)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var start_time = TimeOnly.Parse(doctorSchedule.StartTime_TimeOnly);
            var end_time = TimeOnly.Parse(doctorSchedule.EndTime_TimeOnly);
            var doctorId = doctorSchedule.DoctorId;
            var doctor = _context.Users.FirstOrDefault(u => u.Id == doctorId && u.Specialty_Doc != DoctorSpecialty.None);

            if (doctor == null)
            {
                return NotFound("Doctor not found");
            }
            // var docdateOnly = doctorSchedule.Date_DateOnly;
            // var start_time = doctorSchedule.StartTime_TimeOnly;
            // var end_time = doctorSchedule.EndTime_TimeOnly;
            DateOnly docdateOnly = DateOnly.Parse(doctorSchedule.Date_DateOnly);
            var existingSchedule = _context.DoctorSchedules
                .FirstOrDefault(s => s.DoctorId == doctorId && s.DoctorDate == docdateOnly &&
                                     ((start_time >= s.StartTime && end_time < s.EndTime) ||
                                      (end_time > s.StartTime && end_time <= s.EndTime) ||
                                      (start_time <= s.StartTime && end_time >= s.EndTime)));

            if (existingSchedule != null)
            {
                return BadRequest("The doctor already has a schedule at the specified time.");
            }

            _context.DoctorSchedules.Add(new DoctorSchedule
            {
                DoctorId = doctorId,
                DoctorDate = docdateOnly, // Save as DateOnly
                StartTime = start_time,
                EndTime = end_time
            });
            _context.SaveChanges();

            return Ok(new Status { StatusCode = 1, Message = "Doctor schedule created successfully." });
        }


        [HttpGet]
        [Route("GetDoctorSchedules/{doctorId}")]
        public IActionResult GetDoctorSchedules(string doctorId)
        {
            try
            {
                var doctorSchedules = _context.DoctorSchedules
                    .Where(schedule => schedule.DoctorId == doctorId)
                    .Select(schedule => new ShowDoctorSceduleDTO
                    {
                        SeduleId = schedule.Id,
                        // DoctorId = schedule.DoctorId,
                        Doc_DateOnly = schedule.DoctorDate,
                        dateOfWeek = schedule.DoctorDate.DayOfWeek.ToString(),
                        StartTime_TimeOnly = schedule.StartTime.ToString("HH:mm"), // Format as needed
                        EndTime_TimeOnly = schedule.EndTime.ToString("HH:mm")
                    })
                    .ToList();

                return Ok(new Status { StatusCode = 1, Message = $"List of Schedules for DoctorId: {doctorId}", ShowDoctorSceduleDTO = doctorSchedules });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, new Status { StatusCode = 0, Message = "Error retrieving doctor schedules." });
            }
        }

        [HttpPut]
        [Route("EditDoctorschedules")]
        public IActionResult EditDoctorSchedule([FromBody] EditDoctorScheduleDTO updatedSchedule)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                var scheduleId = updatedSchedule.SeduleId;
                var doctorId = updatedSchedule.DoctorId;

                var existingSchedule = _context.DoctorSchedules.FirstOrDefault(s => s.Id == scheduleId && s.DoctorId == doctorId);

                if (existingSchedule == null)
                {
                    return NotFound("Doctor schedule not found");
                }
                DateOnly docdateOnly = DateOnly.Parse(updatedSchedule.Date_DateOnly);
                // Update properties with new values
                existingSchedule.DoctorDate = docdateOnly;
                existingSchedule.StartTime = TimeOnly.Parse(updatedSchedule.StartTime_TimeOnly);
                existingSchedule.EndTime = TimeOnly.Parse(updatedSchedule.EndTime_TimeOnly);
                // existingSchedule.DoctorDate = updatedSchedule.Date_DateOnly;
                // existingSchedule.StartTime = updatedSchedule.StartTime_TimeOnly;
                // existingSchedule.EndTime = updatedSchedule.EndTime_TimeOnly;
                _context.SaveChanges();

                return Ok(new Status { StatusCode = 1, Message = "Doctor schedule updated successfully." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, new Status { StatusCode = 0, Message = "Error updating doctor schedule." });
            }
        }
        [HttpDelete]
        [Route("DeleteDoctorschedules/{scheduleId}/{doctorId}")]
        public IActionResult DeleteDoctorSchedule(int scheduleId, string doctorId)
        {
            try
            {
                var existingSchedule = _context.DoctorSchedules.FirstOrDefault(s => s.Id == scheduleId && s.DoctorId == doctorId);

                if (existingSchedule == null)
                {
                    return NotFound("Doctor schedule not found");
                }

                _context.DoctorSchedules.Remove(existingSchedule);
                _context.SaveChanges();

                return Ok(new Status { StatusCode = 1, Message = "Doctor schedule deleted successfully." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, new Status { StatusCode = 0, Message = "Error deleting doctor schedule." });
            }
        }
        [HttpGet]
        [Route("GetAllDoctorsSchedulesThisWeek")]
        public IActionResult GetAllDoctorsSchedulesThisWeek()
        {

            var currentDate = DateTime.Today;
            var startOfWeek = currentDate.Date.AddDays(-(int)currentDate.DayOfWeek);
            var endOfWeek = startOfWeek.AddDays(6);
            DateOnly startOfWeek_DateOnly = DateOnly.FromDateTime(startOfWeek);
            DateOnly endOfWeek_DateOnly = DateOnly.FromDateTime(endOfWeek);

            // Retrieve all doctors
            var allDoctors = _context.Users
                .Where(u => u.Specialty_Doc != DoctorSpecialty.None)
                .ToList();

            // Retrieve doctor schedules for the current week for each doctor
            var doctorsSchedulesThisWeek = new List<ShowAllDoctorSchedulesDTO>();

            foreach (var doctor in allDoctors)
            {
                var doctorSchedules = _context.DoctorSchedules
                    .Where(s => s.DoctorId == doctor.Id && s.DoctorDate >= startOfWeek_DateOnly && s.DoctorDate <= endOfWeek_DateOnly)
                    .ToList();


                var scheduleDTOs = doctorSchedules.Select(s => new ShowDoctorSceduleDTO
                {
                    SeduleId = s.Id,
                    // DoctorId = s.DoctorId,
                    Doc_DateOnly = s.DoctorDate,
                    dateOfWeek = s.DoctorDate.DayOfWeek.ToString(),
                    StartTime_TimeOnly = s.StartTime.ToString(),
                    EndTime_TimeOnly = s.EndTime.ToString()
                }).ToList();

                doctorsSchedulesThisWeek.Add(new ShowAllDoctorSchedulesDTO
                {
                    DoctorId = doctor.Id,
                    DoctorName = doctor.Name,
                    AllDoctorSchedules = scheduleDTOs
                });
            }

            return Ok(new Status { StatusCode = 1, Message = "Doctor schedules for all doctors for the current week", DoctorsSchedulesThisWeek = doctorsSchedulesThisWeek });
        }


        [HttpPost]
        [Route("CopyCurrentWeekSchedules")]
        public IActionResult CopyCurrentWeekSchedules()
        {
            DateOnly today = DateOnly.FromDateTime(DateTime.Today);
            DateOnly startOfWeek = today.AddDays(-(int)today.DayOfWeek);
            DateOnly endOfWeek = startOfWeek.AddDays(6);

            // Retrieve the current week's schedule for all doctors
            var currentWeekSchedule = _context.DoctorSchedules
                .Where(s => s.DoctorDate >= startOfWeek && s.DoctorDate <= endOfWeek)
                .ToList();

            if (currentWeekSchedule.Count == 0)
            {
                return BadRequest(new Status { StatusCode = 0, Message = "No schedule found for the current week." });
            }

            try
            {
                // Iterate over all doctors
                var doctorIds = currentWeekSchedule.Select(s => s.DoctorId).Distinct();
                foreach (var doctorId in doctorIds)
                {
                    // Retrieve the doctor's existing schedules for the next week
                    var existingNextWeekSchedules = _context.DoctorSchedules
                        .Where(s => s.DoctorId == doctorId && s.DoctorDate >= startOfWeek.AddDays(7) && s.DoctorDate <= endOfWeek.AddDays(7))
                        .ToList();

                    foreach (var schedule in currentWeekSchedule.Where(s => s.DoctorId == doctorId))
                    {
                        // Check if a schedule already exists for the same day in the next week
                        var existingSchedule = existingNextWeekSchedules.FirstOrDefault(
                            s => s.DoctorDate == schedule.DoctorDate.AddDays(7) &&
                                 s.StartTime == schedule.StartTime &&
                                 s.EndTime == schedule.EndTime);

                        if (existingSchedule == null)
                        {
                            // Clone the current week's schedule for the next week for the current doctor
                            var nextWeekSchedule = new DoctorSchedule
                            {
                                DoctorId = doctorId,
                                DoctorDate = schedule.DoctorDate.AddDays(7), // Increment by 7 days for the next week
                                StartTime = schedule.StartTime,
                                EndTime = schedule.EndTime,
                                // Copy other properties as needed
                            };

                            // Save the cloned schedule to the database
                            _context.DoctorSchedules.Add(nextWeekSchedule);
                        }
                    }
                }

                // Save changes to the database
                _context.SaveChanges();

                return Ok(new Status { StatusCode = 1, Message = "Next week's schedules copied successfully." });
            }
            catch (Exception ex)
            {
                // Handle exceptions as needed
                return StatusCode(StatusCodes.Status500InternalServerError, new Status { StatusCode = 0, Message = "An error occurred while copying schedules." });
            }
        }



    }
}