namespace ClinicBackendApi.Models.Domain
{
    public class UserNotification
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public bool IsNotified { get; set; }


        public ApplicationUser User { get; set; }
    }
}