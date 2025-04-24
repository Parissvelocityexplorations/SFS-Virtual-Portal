namespace SpaceForce.VisitorManagement.Data.Models;

public class SfPivotBase
{
    public DateTime DateCreated { get; set; } = DateTime.UtcNow;
    public DateTime? DateModified { get; set; }
}