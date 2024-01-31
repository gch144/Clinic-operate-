public class LoginDto
{
    public string Token { get; set; }
    public UserDetailsDto User { get; set; }
}

// UserDetailsDto.cs

public class UserDetailsDto
{
    public string UserId { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string UserRole { get; set; }
}
