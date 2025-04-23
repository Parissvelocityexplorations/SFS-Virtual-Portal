using SpaceForce.VisitorManagement.Data.Models.Enumerations;

namespace SpaceForce.VisitorManagement.Data.Models;

public class SfPassType : SfEntityBase
{
    public string Name { get; set; }
    public string Description { get; set; }
    public string Needs { get; set; }
    public SfStatusType Status { get; set; }

    #region Relations

    public ICollection<SfAppointment> Appointments { get; set; } = new HashSet<SfAppointment>();

    #endregion
}