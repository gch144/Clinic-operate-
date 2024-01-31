using ClinicBackendApi.Models.Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ClinicBackendApi.Repositories.Abstract;
using ClinicBackendApi.Models.DTO;
using ClinicBackendApi.Models;
using Microsoft.AspNetCore.Authentication;

namespace ClinicBackendApi.Repositories.Implementation
{
    public class UserAuthenticationService : IUserAuthenticationService
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor httpContextAccessor;
        public UserAuthenticationService(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration)
        {
            this.userManager = userManager;
            this.roleManager = roleManager;
            _configuration = configuration;

        }
        public async Task<Status> Registeration(RegistrationModel model, string role)
        {
            var status = new Status();
            var userExists = await userManager.FindByNameAsync(model.Username);
            if (userExists != null)
            {
                status.StatusCode = 0;
                status.Message = "User already exists";
                return status;
            }
            // return (0, "User already exists");

            ApplicationUser user = new ApplicationUser()
            {
                Email = model.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = model.Username,
                Name = model.Name,
                IsVerified = DetermineVerificationStatus(role)
            };
            var createUserResult = await userManager.CreateAsync(user, model.Password);
            if (!createUserResult.Succeeded)
            {
                status.StatusCode = 0;
                status.Message = "User creation failed! Please check user details and try again.";
                return status;
            }
            // return (0, "User creation failed! Please check user details and try again.");

            if (!await roleManager.RoleExistsAsync(role))
                await roleManager.CreateAsync(new IdentityRole(role));

            if (await roleManager.RoleExistsAsync(UserRoles.Patient))
                await userManager.AddToRoleAsync(user, role);

            // return (1, "User created successfully!");
            status.StatusCode = 1;
            status.Message = "You have registered successfully , Account is pending admin verification.";
            return status;
        }
        public async Task<Status> RegisterationDoctor(RegistrationDoctorModel model, string role)
        {
            var status = new Status();
            var userExists = await userManager.FindByNameAsync(model.Username);
            if (userExists != null)
            {
                status.StatusCode = 0;
                status.Message = "User already exists";
                return status;
            }
            // return (0, "User already exists");

            ApplicationUser user = new ApplicationUser()
            {
                Email = model.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = model.Username,
                Name = model.Name,
                Specialty_Doc = model.Specialty,
                IsVerified = DetermineVerificationStatus(role)
            };
            var createUserResult = await userManager.CreateAsync(user, model.Password);
            if (!createUserResult.Succeeded)
            {
                status.StatusCode = 0;
                status.Message = "User creation failed! Please check user details and try again.";
                return status;
            }
            // return (0, "User creation failed! Please check user details and try again.");

            if (!await roleManager.RoleExistsAsync(role))
                await roleManager.CreateAsync(new IdentityRole(role));

            if (await roleManager.RoleExistsAsync(UserRoles.Patient))
                await userManager.AddToRoleAsync(user, role);

            // return (1, "User created successfully!");
            status.StatusCode = 1;
            status.Message = "You have registered successfully , Account is pending admin verification.";
            return status;
        }
        private bool DetermineVerificationStatus(string role)
        {
            // Set IsVerified to true for specific roles, adjust as needed
            return role == UserRoles.Admin || role == UserRoles.Doctor;
        }
        public async Task<Status> ChangePassword(ChangePasswordModel model)
        {
            var status = new Status();

            // Validate model
            if (!await ValidateModelAsync(model, status))
            {
                return status;
            }

            var user = await userManager.FindByNameAsync(model.Username);
            if (user == null)
            {
                status.StatusCode = 0;
                status.Message = "User not found";
                return status;
            }

            // Change password
            var changePasswordResult = await userManager.ChangePasswordAsync(user, model.CurrentPassword, model.NewPassword);
            if (!changePasswordResult.Succeeded)
            {
                status.StatusCode = 0;
                status.Message = "Password change failed. Please check your current password and try again.";
                return status;
            }

            status.StatusCode = 1;
            status.Message = "Password changed successfully";
            return status;
        }

        private async Task<bool> ValidateModelAsync(ChangePasswordModel model, Status status)
        {
            if (model.NewPassword != model.PasswordConfirm)
            {
                status.StatusCode = 0;
                status.Message = "New password and password confirmation do not match";
                return false;
            }

            return true;
        }
        public async Task<Status> Login(LoginModel model)
        {
            var status = new Status();
            var user = await userManager.FindByNameAsync(model.Username);
            if (user == null)
                if (user == null)
                {
                    status.StatusCode = 0;
                    status.Message = "Invalid username";
                    return status;
                }
            if (!user.IsVerified)
            {
                status.StatusCode = 1;
                status.Message = "User is not verified";
                return status;
            }
            if (!await userManager.CheckPasswordAsync(user, model.Password))
            {
                status.StatusCode = 0;
                status.Message = "Invalid Password";
                return status;
            }
            var userRoles = await userManager.GetRolesAsync(user);
            var authClaims = new List<Claim>
            {
               new Claim(ClaimTypes.Name, user.UserName),
               new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            foreach (var userRole in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, userRole));
            }
            string token = GenerateToken(authClaims);
            status.StatusCode = 1;
            status.Message = "Login successful";
            var userDetailsDto = new UserDetailsDto
            {
                UserId = user.Id,
                Name = user.Name,
                Email = user.Email,
                UserRole = userRoles.FirstOrDefault() // Assuming the user has only one role for simplicity
            };
            // Console.WriteLine(userDetailsDto.UserRole);
            // Console.WriteLine(userDetailsDto.UserId);
            var loginDto = new LoginDto
            {
                Token = token,
                User = userDetailsDto
            };
            status.LoginInfo = loginDto;
            return status;
        }
        // public async Task<Status> Logout()
        // {
        //     var status = new Status();

        //     // Retrieve the user from the current context
        //     var user = await userManager.GetUserAsync(httpContextAccessor.HttpContext.User);

        //     if (user == null)
        //     {
        //         status.StatusCode = 0;
        //         status.Message = "User not found";
        //         return status;
        //     }

        //     // Sign out the user
        //     await httpContextAccessor.HttpContext.SignOutAsync();

        //     status.StatusCode = 1;
        //     status.Message = "Logout successful";

        //     return status;
        // }

        private string GenerateToken(IEnumerable<Claim> claims)
        {
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Issuer = _configuration["JWT:ValidIssuer"],
                Audience = _configuration["JWT:ValidAudience"],
                Expires = DateTime.UtcNow.AddHours(3),
                SigningCredentials = new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256),
                Subject = new ClaimsIdentity(claims)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}