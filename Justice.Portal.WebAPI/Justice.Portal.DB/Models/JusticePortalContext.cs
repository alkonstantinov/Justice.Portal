using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Justice.Portal.DB.Models
{
    public partial class JusticePortalContext : DbContext
    {
        public JusticePortalContext()
        {
        }

        public JusticePortalContext(DbContextOptions<JusticePortalContext> options)
            : base(options)
        {
        }

        public virtual DbSet<PortalPart> PortalPart { get; set; }
        public virtual DbSet<PortalUser> PortalUser { get; set; }
        public virtual DbSet<PortalUser2Right> PortalUser2Right { get; set; }
        public virtual DbSet<Session> Session { get; set; }
        public virtual DbSet<UserRight> UserRight { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseSqlServer("Server=DESKTOP-NIQT1U7\\SQLEXPRESS;Database=JusticePortal;Trusted_Connection=True;persist security info=True;user id=sa;password=123;MultipleActiveResultSets=True;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("ProductVersion", "2.2.4-servicing-10062");

            modelBuilder.Entity<PortalPart>(entity =>
            {
                entity.Property(e => e.PortalPartId).ValueGeneratedNever();

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<PortalUser>(entity =>
            {
                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.Password)
                    .IsRequired()
                    .HasMaxLength(32);

                entity.Property(e => e.UserName)
                    .IsRequired()
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<PortalUser2Right>(entity =>
            {
                entity.HasIndex(e => e.PortalUserId)
                    .HasName("idx_PortalUser2Right_PortalUserId");

                entity.HasIndex(e => e.UserRightId)
                    .HasName("idx_PortalUser2Right_UserRightId");

                entity.HasOne(d => d.PortalUser)
                    .WithMany(p => p.PortalUser2Right)
                    .HasForeignKey(d => d.PortalUserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_PortalUser2Right_PortalUserId");

                entity.HasOne(d => d.UserRight)
                    .WithMany(p => p.PortalUser2Right)
                    .HasForeignKey(d => d.UserRightId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_PortalUser2Right_UserRightId");
            });

            modelBuilder.Entity<Session>(entity =>
            {
                entity.HasIndex(e => e.PortalUserId)
                    .HasName("idx_Session_PortalUserId");

                entity.Property(e => e.CreatedOn).HasColumnType("datetime");

                entity.Property(e => e.LastEdit).HasColumnType("datetime");

                entity.HasOne(d => d.PortalUser)
                    .WithMany(p => p.Session)
                    .HasForeignKey(d => d.PortalUserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_Session_PortalUserId");
            });

            modelBuilder.Entity<UserRight>(entity =>
            {
                entity.HasIndex(e => e.Name)
                    .HasName("idx_UserRight_Name")
                    .IsUnique();

                entity.Property(e => e.UserRightId).ValueGeneratedNever();

                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(20);
            });
        }
    }
}
