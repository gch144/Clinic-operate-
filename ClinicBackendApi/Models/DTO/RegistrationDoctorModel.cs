using System.ComponentModel.DataAnnotations;
using ClinicBackendApi.Models.Domain;

namespace ClinicBackendApi.Models.DTO
{


    public class RegistrationDoctorModel
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string Username { get; set; }
        [Required]
        [EmailAddress]
        [RegularExpression(@"^.*@doc\.com$", ErrorMessage = "Email must end with @doc.com")]
        public string? Email { get; set; }
        [Required]
        [RegularExpression("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*[#$^+=!*()@%&]).{6,}$", ErrorMessage = "Minimum length 6 and must contain  1 Uppercase,1 lowercase, 1 special character and 1 digit")]
        public string Password { get; set; }
        [Required]
        [Compare("Password")]
        public string PasswordConfirm { get; set; }
        public DoctorSpecialty Specialty { get; set; }
    }
}