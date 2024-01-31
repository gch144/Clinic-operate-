using ClinicBackendApi.Models.DTO;
using ClinicBackendApi.Models.Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ClinicBackendApi.Models;
namespace ClinicBackendApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AppointmentController : ControllerBase
    {
        private readonly DatabaseContext _context;
        private readonly UserManager<ApplicationUser> userManager;
        private readonly ILogger<AppointmentController> _logger;

        public AppointmentController(UserManager<ApplicationUser> userManager, ILogger<AppointmentController> logger, DatabaseContext context)
        {
            this.userManager = userManager;
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        [Authorize]
        [Route("SearchDoctorsBySpecialty")]
        public async Task<IActionResult> SearchDoctorsBySpecialty([FromQuery] DoctorSpecialty doctorSpecialty)
        {
            try
            {
                // Retrieve doctors based on the provided specialty
                var doctors = _context.Users
                    .Where(u => u.Specialty_Doc == doctorSpecialty && u.Specialty_Doc != DoctorSpecialty.None)
                    .Select(d => new DoctorDTO { DoctorId = d.Id, Name = d.Name, Specialization = d.Specialty_Doc.ToString() })
                    .ToList();

                return Ok(new Status { StatusCode = 1, Message = "Doctors found.", DoctorUsers = doctors });
            }
            catch (Exception ex)
            {
                // Log the exception or handle it as needed
                _logger.LogError(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, new Status { StatusCode = 0, Message = "An error occurred while searching for doctors." });
            }
        }



        [HttpGet]
        [Authorize(Roles = UserRoles.Patient)]
        [Route("DisplayDoctorAvailability")]
        public IActionResult DisplayDoctorAvailability(string doctorId)
        {
            try
            {
                // Validate if the doctorId is provided
                if (string.IsNullOrEmpty(doctorId))
                {
                    return BadRequest(new Status { StatusCode = 0, Message = "DoctorId is required." });
                }
                var currentDate = DateOnly.FromDateTime(DateTime.Now);

                // Retrieve the doctor's schedule
                var doctorSchedules = _context.DoctorSchedules
                    .Where(s => s.DoctorId == doctorId && s.DoctorDate >= currentDate)
                    .Select(s => new ShowDoctorSceduleDTO
                    {
                        SeduleId = s.Id,
                        Doc_DateOnly = s.DoctorDate,
                        dateOfWeek = s.DoctorDate.DayOfWeek.ToString(),

                    })
                    .ToList();

                // You can customize the DTO or response format based on your requirements

                return Ok(new Status { StatusCode = 1, Message = "Doctor's availability retrieved successfully.", ShowDoctorSceduleDTO = doctorSchedules });
            }
            catch (Exception ex)
            {
                // Log the exception or handle it as needed
                _logger.LogError(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, new Status { StatusCode = 0, Message = "An error occurred while retrieving doctor's availability." });
            }
        }

        [HttpGet]
        [Authorize(Roles = UserRoles.Patient)]
        [Route("DisplayAvailableTimeSlots")]
        public IActionResult DisplayAvailableTimeSlots(string doctorId, string doctordate)
        {
            // var start_time = TimeOnly.Parse(startTime);
            // var end_time = TimeOnly.Parse(doctorSchedule.EndTime_TimeOnly);
            DateOnly docdateOnly = DateOnly.Parse(doctordate);
            DateOnly currentDate = DateOnly.FromDateTime(DateTime.Now);
            Console.WriteLine("docdateOnly: " + docdateOnly);
            Console.WriteLine("currentDate: " + currentDate);

            var doctorSchedule = _context.DoctorSchedules
                .Where(ds => ds.DoctorId == doctorId && ds.DoctorDate == docdateOnly && ds.DoctorDate >= currentDate)
                .FirstOrDefault();

            if (doctorSchedule == null)
            {
                return Ok(new Status { StatusCode = 0, Message = "Doctor's schedule not found." });
            }

            // Generate available time slots based on the doctor's schedule
            var availableTimeSlots = GenerateAvailableTimeSlots(doctorSchedule);

            var availableTimeSlotsDTOs = availableTimeSlots.Select(slot => new DisplayAvailableTimeSlotsDTO
            {
                // DoctorId = slot.DoctorId,
                AppointmentDate = slot.AppointmentDate,
                StartTime = slot.StartTime,
                EndTime = slot.EndTime
            }).ToList();

            return Ok(new Status { StatusCode = 1, Message = "Available time slots retrieved successfully.", AvailableTimeSlots = availableTimeSlotsDTOs });
        }

        private List<Appointment> GenerateAvailableTimeSlots(DoctorSchedule doctorSchedule)
        {
            var availableTimeSlots = new List<Appointment>();


            DateOnly currentDate = doctorSchedule.DoctorDate;
            TimeOnly currentTime = doctorSchedule.StartTime;
            TimeOnly endTime = doctorSchedule.EndTime;

            while (currentTime.AddMinutes(15) <= endTime)
            {
                var timeSlot = new Appointment
                {
                    DoctorId = doctorSchedule.DoctorId,
                    AppointmentDate = currentDate,
                    StartTime = currentTime,
                    EndTime = currentTime.AddMinutes(15),
                };

                availableTimeSlots.Add(timeSlot);

                currentTime = currentTime.AddMinutes(15);
            }

            return availableTimeSlots;
        }



        [HttpPost]
        [Authorize(Roles = UserRoles.Patient)]
        [Route("BookAppointment")]
        public IActionResult BookAppointment(BookAppointmentDTO bookAppointmentDTO)
        {
            DateOnly appDate = DateOnly.Parse(bookAppointmentDTO.AppointmentDate);
            TimeOnly time = TimeOnly.Parse(bookAppointmentDTO.StartTime_TimeOnly);
            DateOnly currentDate = DateOnly.FromDateTime(DateTime.Now);
            var doctorId = bookAppointmentDTO.DoctorId;
            var patientId = GetCurrentUserId().Result;
            var SeduleId = _context.DoctorSchedules
                .Where(ds => ds.DoctorId == doctorId && ds.DoctorDate == appDate && ds.DoctorDate >= currentDate).Select(ds => ds.Id)
                .FirstOrDefault();


            // Check if the appointment slot is available
            var isSlotAvailable = IsAppointmentSlotAvailable(doctorId, appDate, time);
            if (!isSlotAvailable)
            {
                return Ok(new Status { StatusCode = 0, Message = "Appointment slot is not available." });
            }

            var appointment = new Appointment
            {
                DoctorId = doctorId,
                DoctorScheduleId = SeduleId,
                PatientId = patientId,
                AppointmentDate = appDate,
                StartTime = time,
                EndTime = time.AddMinutes(15),
                Description = "Doctor need to write....",

            };
            // Console.WriteLine("appointment: " + appointment);
            _context.Appointments.Add(appointment);
            _context.SaveChanges();

            return Ok(new Status { StatusCode = 1, Message = "Appointment booked successfully." });
        }
        [HttpGet]
        [Authorize(Roles = UserRoles.Patient)]
        [Route("DisplayPatientAppointments")]
        public IActionResult DisplayPatientAppointments()
        {
            try
            {
                var patientId = GetCurrentUserId().Result;
                var patientAppointments = _context.Appointments
                    .Where(a => a.PatientId == patientId)
                    .ToList();
                var patientcheckAppointments = _context.Appointments
                    .Where(a => a.PatientId == patientId)
                    .ToList().Count();
                // var doctorId = _context.Appointments
                //     .Where(a => a.PatientId == patientId)
                //     .Select(a => a.DoctorId)
                //     .FirstOrDefault();


                if (patientcheckAppointments == 0)
                {
                    return Ok(new Status { StatusCode = 0, Message = "You didnot have any Appointment Yet" });
                }


                else
                {
                    var appointmentDTOs = patientAppointments.Select(a => new AppointmentDTO
                    {
                        AppointmentId = a.Id,
                        Id = a.DoctorId,
                        Name = _context.Users
                                .Where(u => u.Id == a.DoctorId)
                                .Select(u => u.Name)
                                .FirstOrDefault(),
                        AppointmentDate = a.AppointmentDate.ToString("yyyy-MM-dd"),
                        StartTime = a.StartTime.ToString("HH:mm"),
                        EndTime = a.EndTime.ToString("HH:mm"),
                        Description = a.Description
                    }).ToList();
                    return Ok(new Status { StatusCode = 1, Message = "Patient appointments retrieved successfully.", Appointments = appointmentDTOs });
                }
                //return Ok(new Status { StatusCode = 1, Message = "Patient appointments retrieved successfully.", Appointments = appointmentDTOs });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, new Status { StatusCode = 0, Message = "Error retrieving patient appointments." });
            }
        }
        [HttpDelete]
        [Authorize(Roles = UserRoles.Patient)]
        [Route("CancelAppointment/{appointmentId}")]
        public IActionResult CancelAppointment(int appointmentId)
        {
            try
            {
                var currentUser = GetCurrentUserId().Result;
                var appointment = _context.Appointments
                    .FirstOrDefault(a => a.Id == appointmentId && a.PatientId == currentUser);

                if (appointment == null)
                {
                    return Ok(new Status { StatusCode = 0, Message = "Appointment not found or you do not have permission to cancel it." });
                }

                _context.Appointments.Remove(appointment);
                _context.SaveChanges();

                return Ok(new Status { StatusCode = 1, Message = "Appointment canceled successfully." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, new Status { StatusCode = 0, Message = "Error canceling appointment." });
            }
        }
        [HttpGet]
        [Authorize(Roles = UserRoles.Doctor)]
        [Route("DisplayDoctorAppointments")]
        public IActionResult DisplayDoctorAppointments()
        {
            try
            {
                var doctorId = GetCurrentUserId().Result;
                var doctorAppointments = _context.Appointments
                    .Where(a => a.DoctorId == doctorId)
                    .ToList();
                var doctorcheckAppointments = _context.Appointments
                    .Where(a => a.DoctorId == doctorId)
                    .ToList().Count();
                // var patientId = _context.Appointments
                //     .Where(a => a.DoctorId == doctorId)
                //     .Select(a => a.PatientId)
                //     .FirstOrDefault();
                // var patientName = _context.Users
                //     .Where(u => u.Id == doctorAppointments.PatientId)
                //     .Select(u => u.Name)
                //     .FirstOrDefault();
                if (doctorcheckAppointments == 0)
                {
                    return Ok(new Status { StatusCode = 0, Message = "You didnot have any Appointment Yet" });
                }
                else
                {
                    var appointmentDTOs = doctorAppointments.Select(a => new AppointmentDTO
                    {
                        AppointmentId = a.Id,
                        Id = a.PatientId,
                        Name = _context.Users
                                .Where(u => u.Id == a.PatientId)
                                .Select(u => u.Name)
                                .FirstOrDefault(),
                        AppointmentDate = a.AppointmentDate.ToString("yyyy-MM-dd"),
                        StartTime = a.StartTime.ToString("HH:mm"),
                        Description = a.Description,
                    }).ToList();

                    return Ok(new Status { StatusCode = 1, Message = "Doctor appointments retrieved successfully.", Appointments = appointmentDTOs });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, new Status { StatusCode = 0, Message = "Error retrieving patient appointments." });
            }
        }
        [HttpPut]
        [Authorize(Roles = UserRoles.Doctor)]
        [Route("CheckAppointment")]
        public IActionResult UpdateAppointment(UpdateAppointmentDTO updateAppointment)
        {
            try
            {
                int appointmentId = int.Parse(updateAppointment.AppointmentId);
                var description = updateAppointment.Description;
                var doctorId = GetCurrentUserId().Result;
                var appointment = _context.Appointments
                    .FirstOrDefault(a => a.Id == appointmentId && a.DoctorId == doctorId);

                if (appointment == null)
                {
                    return Ok(new Status { StatusCode = 0, Message = "Appointment not found or you do not have permission to update it." });
                }

                appointment.Description = description;
                _context.SaveChanges();

                return Ok(new Status { StatusCode = 1, Message = "Appointment updated successfully." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, new Status { StatusCode = 0, Message = "Error updating appointment." });
            }
        }
        private bool IsAppointmentSlotAvailable(string doctorId, DateOnly appointmentDate, TimeOnly startTime)
        {
            // Check if there is an existing appointment for the same doctor, date, and time
            return !_context.Appointments.Any(a =>
                a.DoctorId == doctorId &&
                a.AppointmentDate == appointmentDate &&
                (a.StartTime == startTime)
            );
        }
        private async Task<string> GetCurrentUserId()
        {

            return (await userManager.FindByNameAsync(User.Identity.Name)).Id;
        }
    }
}
