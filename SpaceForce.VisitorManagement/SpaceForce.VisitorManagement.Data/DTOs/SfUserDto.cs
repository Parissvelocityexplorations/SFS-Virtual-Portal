namespace SpaceForce.VisitorManagement.Data.DTOs
{
    public class SfUserDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNo { get; set; } = string.Empty;
        public string? Service { get; set; } = null;
        public string? Sponsor { get; set; } = null;
    }
}