using SpaceForce.VisitorManagement.Data.Models.Enumerations;

namespace SpaceForce.VisitorManagement.Data.Models;

public class SfStatus: SfEntityBase
{
    public string Name { get; set; }
    public string Description { get; set; }
    public SfStatusType Type { get; set; }

    #region Regions

    public ICollection<SfAppointmentStatus> Appointments { get; set; } = new HashSet<SfAppointmentStatus>();

    #endregion
}