

namespace ClinicBackendApi.Models.DTO
{
    public class AppointmentDTO
    {
        public int AppointmentId { get; set; }
        public string Id { get; set; }
        public string Name { get; set; }
        public string AppointmentDate { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public string Description { get; set; }
    }
}
