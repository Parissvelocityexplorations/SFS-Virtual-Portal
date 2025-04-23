using Microsoft.EntityFrameworkCore;
using SpaceForce.VisitorManagement.Data.Models;

namespace SpaceForce.VisitorManagement.Data.DbContexts;

public class SfDbContext:DbContext
{
    private string _schema = "sf_visitor_management";
    
    #region Db Sets
    
    public DbSet<SfUser> Users { get; set; }
    public DbSet<SfAppointment> Appointments { get; set; }
    public DbSet<SfAppointmentStatus> AppointmentStatuses { get; set; }
    public DbSet<SfPassType> PassTypes { get; set; }
    public DbSet<SfStatus> Statuses { get; set; }
    
    #endregion

    public SfDbContext()
    {
        //
    }

    public SfDbContext(DbContextOptions<SfDbContext> options) : base(options)
    {
        //
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseNpgsql(x => x.MigrationsHistoryTable("__migrations_history", _schema));
        optionsBuilder.LogTo(Console.WriteLine);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<SfUser>().HasKey(x => x.Id);
        modelBuilder.Entity<SfUser>().HasIndex(x => x.Email).IsUnique();
        modelBuilder.Entity<SfUser>().Property(x => x.Email).IsRequired();
        modelBuilder.Entity<SfUser>().Property(x => x.FirstName).IsRequired();
        modelBuilder.Entity<SfUser>().Property(x => x.LastName).IsRequired();
        modelBuilder.Entity<SfUser>().Property(x => x.PhoneNo).IsRequired();
        modelBuilder.Entity<SfUser>()
            .HasMany(x => x.Appointments)
            .WithOne(x => x.User)
            .HasForeignKey(x => x.UserId);
        modelBuilder.Entity<SfAppointment>().HasKey(x => x.Id);
        modelBuilder.Entity<SfAppointment>().Property(x => x.Date).IsRequired();
        modelBuilder.Entity<SfAppointment>()
            .HasOne(x => x.PassType)
            .WithMany(x => x.Appointments)
            .HasForeignKey(x => x.PassTypeId);

        modelBuilder.Entity<SfAppointmentStatus>().HasKey(x => new {x.AppointmentId, x.StatusId});
        modelBuilder.Entity<SfAppointment>()
            .HasMany(x => x.Statuses)
            .WithOne(x => x.Appointment)
            .HasForeignKey(x => x.AppointmentId);
        modelBuilder.Entity<SfStatus>()
            .HasMany(x => x.Appointments)
            .WithOne(x => x.Status)
            .HasForeignKey(x => x.StatusId);
    }
}