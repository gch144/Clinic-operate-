public class ShowAllDoctorSchedulesDTO
{
    public string? DoctorId { get; set; }
    public string? DoctorName { get; set; }
    public List<ShowDoctorSceduleDTO> ?AllDoctorSchedules { get; set; }
}
