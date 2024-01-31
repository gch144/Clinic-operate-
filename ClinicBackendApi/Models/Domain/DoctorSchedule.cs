using ClinicBackendApi.Models.Domain;

public class DoctorSchedule
{
    public int Id { get; set; }

    // Foreign key to link to the User (Doctor)
    public string DoctorId { get; set; }

    public DateOnly DoctorDate { get; set; }

    public TimeOnly StartTime { get; set; }

    public TimeOnly EndTime { get; set; }


    public virtual ApplicationUser Doctor { get; set; }
    public virtual ICollection<Appointment> Appointments { get; set; }
}