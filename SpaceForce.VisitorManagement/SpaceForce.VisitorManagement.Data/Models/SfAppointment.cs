using SpaceForce.VisitorManagement.Data.Models.Enumerations;

namespace SpaceForce.VisitorManagement.Data.Models;

public class SfAppointment:SfEntityBase
{
    public Guid UserId { get; set; }
    public DateTime Date { get; set; }

    #region Relations
    
    public SfUser? User { get; set; }
    public SfPassType PassType { get; set; } = SfPassType.NotSet;
    public SfStatus Status { get; set; } = SfStatus.NotSet;

    #endregion
}