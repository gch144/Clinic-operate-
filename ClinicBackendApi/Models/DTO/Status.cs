using System.Text.Json.Serialization;
using ClinicBackendApi.Models.Domain;

namespace ClinicBackendApi.Models.DTO
{
    public class Status
    {
        public int StatusCode { get; set; }

        public string? Message { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public List<ApplicationUser>? Users { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public List<PatientDTO>? PatientUsers { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public List<DoctorDTO>? DoctorUsers { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public List<ShowDoctorSceduleDTO>? ShowDoctorSceduleDTO { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public List<ShowAllDoctorSchedulesDTO>? DoctorsSchedulesThisWeek { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public List<DisplayAvailableTimeSlotsDTO>? AvailableTimeSlots { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public List<AppointmentDTO>? Appointments { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public LoginDto? LoginInfo { get; set; }
    }
}