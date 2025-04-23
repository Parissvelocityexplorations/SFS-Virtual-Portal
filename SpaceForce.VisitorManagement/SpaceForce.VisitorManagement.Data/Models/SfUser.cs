namespace SpaceForce.VisitorManagement.Data.Models;

public class SfUser
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string PhoneNo { get; set; }
    
    #region Relations

    public ICollection<SfAppointment> Appointments { get; set; } = new HashSet<SfAppointment>();

    #endregion

}