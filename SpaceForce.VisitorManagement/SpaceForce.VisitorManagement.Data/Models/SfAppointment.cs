namespace SpaceForce.VisitorManagement.Data.Models;

public class SfAppointment:SfEntityBase
{
    public Guid UserId { get; set; }
    public Guid PassTypeId { get; set; }
    public DateTime Date { get; set; }

    #region Relations
    
    public SfUser? User { get; set; }
    public SfPassType? PassType { get; set; }
    public ICollection<SfAppointmentStatus> Statuses { get; set; } = new HashSet<SfAppointmentStatus>();

    #endregion
}