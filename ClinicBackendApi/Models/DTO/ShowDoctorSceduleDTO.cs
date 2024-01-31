using System.Text.Json.Serialization;

public class ShowDoctorSceduleDTO
{
    // [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? SeduleId { get; set; }
    // public string? DoctorId { get; set; }
    // public string? DoctorName { get; set; }
    public DateOnly Doc_DateOnly { get; set; }
    public string? dateOfWeek { get; set; }
    // [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? StartTime_TimeOnly { get; set; }
    // [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? EndTime_TimeOnly { get; set; }
}