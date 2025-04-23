namespace SpaceForce.VisitorManagement.Data.Models;

public class SfAppointmentStatus:SfPivotBase
{
    public Guid AppointmentId { get; set; }
    public Guid StatusId { get; set; }

    #region Relations

    public SfAppointment? Appointment { get; set; }
    public SfStatus? Status { get; set; }

    #endregion
}