using ClinicBackendApi.Models.DTO;

namespace ClinicBackendApi.Repositories.Abstract
{
    public interface IUserAuthenticationService
    {
        Task<Status> Registeration(RegistrationModel model, string role);
        Task<Status> Login(LoginModel model);
        // Task<Status> Logout();
        Task<Status> ChangePassword(ChangePasswordModel model);
        Task<Status> RegisterationDoctor(RegistrationDoctorModel model, string role);

    }
}