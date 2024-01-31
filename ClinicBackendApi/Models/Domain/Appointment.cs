using ClinicBackendApi.Models.Domain;

public class Appointment
{
    public int Id { get; set; }
    public int? DoctorScheduleId { get; set; }
    public string DoctorId { get; set; }
    public string PatientId { get; set; }
    public DateOnly AppointmentDate { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public string? Description { get; set; }

    public virtual ApplicationUser Doctor { get; set; }
    public virtual ApplicationUser Patient { get; set; }
    public virtual DoctorSchedule DoctorSchedule { get; set; }
}