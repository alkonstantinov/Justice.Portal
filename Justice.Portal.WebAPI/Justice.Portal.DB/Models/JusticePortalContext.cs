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

        public virtual DbSet<Blob> Blob { get; set; }
        public virtual DbSet<Block> Block { get; set; }
        public virtual DbSet<BlockType> BlockType { get; set; }
        public virtual DbSet<BlockTypeProperty> BlockTypeProperty { get; set; }
        public virtual DbSet<BlockTypePropertyValue> BlockTypePropertyValue { get; set; }
        public virtual DbSet<Collection> Collection { get; set; }
        public virtual DbSet<Header> Header { get; set; }
        public virtual DbSet<InnerDoc> InnerDoc { get; set; }
        public virtual DbSet<Log> Log { get; set; }
        public virtual DbSet<Pklabel> Pklabel { get; set; }
        public virtual DbSet<PortalGroup> PortalGroup { get; set; }
        public virtual DbSet<PortalGroup2Part> PortalGroup2Part { get; set; }
        public virtual DbSet<PortalGroup2Right> PortalGroup2Right { get; set; }
        public virtual DbSet<PortalGroup2Rubric> PortalGroup2Rubric { get; set; }
        public virtual DbSet<PortalPart> PortalPart { get; set; }
        public virtual DbSet<PortalUser> PortalUser { get; set; }
        public virtual DbSet<PortalUser2Group> PortalUser2Group { get; set; }
        public virtual DbSet<PortalUser2Part> PortalUser2Part { get; set; }
        public virtual DbSet<PortalUser2Right> PortalUser2Right { get; set; }
        public virtual DbSet<PortalUser2Rubric> PortalUser2Rubric { get; set; }
        public virtual DbSet<Property> Property { get; set; }
        public virtual DbSet<Rubric> Rubric { get; set; }
        public virtual DbSet<Session> Session { get; set; }
        public virtual DbSet<Template> Template { get; set; }
        public virtual DbSet<Translation> Translation { get; set; }
        public virtual DbSet<UserAction> UserAction { get; set; }
        public virtual DbSet<UserRight> UserRight { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseSqlServer("Server=172.16.0.56\\MSSQLSERVER2017;Database=JusticePortal;Trusted_Connection=False;persist security info=True;user id = sa; password=@D1mitrov;MultipleActiveResultSets=True;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("ProductVersion", "2.2.4-servicing-10062");

            modelBuilder.Entity<Blob>(entity =>
            {
                entity.HasIndex(e => e.Hash)
                    .HasName("ix_blob_hash")
                    .IsUnique();

                entity.Property(e => e.Content).IsRequired();

                entity.Property(e => e.ContentType)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.Extension)
                    .IsRequired()
                    .HasMaxLength(10);

                entity.Property(e => e.Filename).IsRequired();

                entity.Property(e => e.Hash)
                    .IsRequired()
                    .HasMaxLength(32);
            });

            modelBuilder.Entity<Block>(entity =>
            {
                entity.HasIndex(e => e.BlockTypeId)
                    .HasName("idx_Block_BlockTypeId");

                entity.HasIndex(e => e.PortalPartId)
                    .HasName("idx_Block_PortalPartId");

                entity.HasIndex(e => e.RubricId)
                    .HasName("ix_block_rubricId");

                entity.HasIndex(e => e.Url)
                    .HasName("ix_block_url")
                    .IsUnique();

                entity.HasIndex(e => new { e.PortalPartId, e.IsMain })
                    .HasName("ix_block_part_main")
                    .IsUnique()
                    .HasFilter("([IsMain]=(1))");

                entity.Property(e => e.BlockTypeId)
                    .IsRequired()
                    .HasMaxLength(20);

                entity.Property(e => e.IsActive)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.Jsonvalues).HasColumnName("JSONValues");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(e => e.PortalPartId)
                    .IsRequired()
                    .HasMaxLength(20);

                entity.Property(e => e.Url)
                    .IsRequired()
                    .HasMaxLength(500);

                entity.HasOne(d => d.BlockType)
                    .WithMany(p => p.Block)
                    .HasForeignKey(d => d.BlockTypeId)
                    .HasConstraintName("fk_Block_BlockTypeId");

                entity.HasOne(d => d.PortalPart)
                    .WithMany(p => p.Block)
                    .HasForeignKey(d => d.PortalPartId)
                    .HasConstraintName("fk_Block_PortalPartId");

                entity.HasOne(d => d.Rubric)
                    .WithMany(p => p.Block)
                    .HasForeignKey(d => d.RubricId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_Block_RubricID");
            });

            modelBuilder.Entity<BlockType>(entity =>
            {
                entity.Property(e => e.BlockTypeId)
                    .HasMaxLength(20)
                    .ValueGeneratedNever();

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(200);
            });

            modelBuilder.Entity<BlockTypeProperty>(entity =>
            {
                entity.HasIndex(e => e.BlockTypeId)
                    .HasName("idx_BlockTypeProperty_BlockTypeId");

                entity.HasIndex(e => e.PropertyId)
                    .HasName("idx_BlockTypeProperty_PropertyId");

                entity.HasIndex(e => new { e.BlockTypeId, e.PropertyId })
                    .HasName("ix_BlockTypeProperty_BlockTypeId_PropertyId")
                    .IsUnique();

                entity.Property(e => e.BlockTypeId)
                    .IsRequired()
                    .HasMaxLength(20);

                entity.Property(e => e.PropertyId)
                    .IsRequired()
                    .HasMaxLength(20);

                entity.HasOne(d => d.BlockType)
                    .WithMany(p => p.BlockTypeProperty)
                    .HasForeignKey(d => d.BlockTypeId)
                    .HasConstraintName("fk_BlockTypeProperty_BlockTypeId");

                entity.HasOne(d => d.Property)
                    .WithMany(p => p.BlockTypeProperty)
                    .HasForeignKey(d => d.PropertyId)
                    .HasConstraintName("fk_BlockTypeProperty_PropertyId");
            });

            modelBuilder.Entity<BlockTypePropertyValue>(entity =>
            {
                entity.HasIndex(e => e.BlockId)
                    .HasName("idx_BlockTypePropertyValue_BlockId");

                entity.HasIndex(e => e.PropertyId)
                    .HasName("idx_BlockTypePropertyValue_PropertyId");

                entity.Property(e => e.PropertyId)
                    .IsRequired()
                    .HasMaxLength(20);

                entity.HasOne(d => d.Block)
                    .WithMany(p => p.BlockTypePropertyValue)
                    .HasForeignKey(d => d.BlockId)
                    .HasConstraintName("fk_BlockTypePropertyValue_BlockId");

                entity.HasOne(d => d.Property)
                    .WithMany(p => p.BlockTypePropertyValue)
                    .HasForeignKey(d => d.PropertyId)
                    .HasConstraintName("fk_BlockTypePropertyValue_PropertyId");
            });

            modelBuilder.Entity<Collection>(entity =>
            {
                entity.HasIndex(e => e.PortalPartId)
                    .HasName("ix_Collection_PortalPartId");

                entity.Property(e => e.Content).IsRequired();

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(e => e.PortalPartId)
                    .IsRequired()
                    .HasMaxLength(20)
                    .HasDefaultValueSql("('min')");

                entity.Property(e => e.Structure).IsRequired();

                entity.HasOne(d => d.PortalPart)
                    .WithMany(p => p.Collection)
                    .HasForeignKey(d => d.PortalPartId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_Collection_PortalPartId");
            });

            modelBuilder.Entity<Header>(entity =>
            {
                entity.HasIndex(e => e.PortalPartId)
                    .HasName("ix_Header_PortalPartId");

                entity.Property(e => e.Content).IsRequired();

                entity.Property(e => e.PortalPartId)
                    .IsRequired()
                    .HasMaxLength(20)
                    .HasDefaultValueSql("('min')");

                entity.Property(e => e.Title).IsRequired();

                entity.HasOne(d => d.PortalPart)
                    .WithMany(p => p.Header)
                    .HasForeignKey(d => d.PortalPartId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk_Header_PortalPartId");
            });

            modelBuilder.Entity<InnerDoc>(entity =>
            {
                entity.HasIndex(e => e.PortalPartId)
                    .HasName("idx_InnerDoc_PortalPartId");

                entity.Property(e => e.PortalPartId)
                    .IsRequired()
                    .HasMaxLength(20);

                entity.HasOne(d => d.PortalPart)
                    .WithMany(p => p.InnerDoc)
                    .HasForeignKey(d => d.PortalPartId)
                    .HasConstraintName("fk_InnerDoc_PortalPartId");
            });

            modelBuilder.Entity<Log>(entity =>
            {
                entity.Property(e => e.Level).HasMaxLength(128);

                entity.Property(e => e.Properties).HasColumnType("xml");
            });

            modelBuilder.Entity<Pklabel>(entity =>
            {
                entity.ToTable("PKLabel");

                entity.HasIndex(e => e.PklabelGroup)
                    .HasName("ix_PKLabel_PKLabelGroup");

                entity.Property(e => e.PklabelId)
                    .HasColumnName("PKLabelId")
                    .ValueGeneratedNever();

                entity.Property(e => e.PklabelGroup)
                    .IsRequired()
                    .HasColumnName("PKLabelGroup")
                    .HasMaxLength(5);

                entity.Property(e => e.TitleBg)
                    .IsRequired()
                    .HasColumnName("TitleBG");

                entity.Property(e => e.TitleEn).HasColumnName("TitleEN");
            });

            modelBuilder.Entity<PortalGroup>(entity =>
            {
                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100);
            });

            modelBuilder.Entity<PortalGroup2Part>(entity =>
            {
                entity.HasIndex(e => e.PortalGroupId)
                    .HasName("idx_PortalGroup2Part_PortalGroupId");

                entity.HasIndex(e => e.PortalPartId)
                    .HasName("idx_PortalGroup2Part_PortalPartId");

                entity.Property(e => e.PortalPartId)
                    .IsRequired()
                    .HasMaxLength(20);

                entity.HasOne(d => d.PortalGroup)
                    .WithMany(p => p.PortalGroup2Part)
                    .HasForeignKey(d => d.PortalGroupId)
                    .HasConstraintName("fk_PortalGroup2Part_PortalGroupId");

                entity.HasOne(d => d.PortalPart)
                    .WithMany(p => p.PortalGroup2Part)
                    .HasForeignKey(d => d.PortalPartId)
                    .HasConstraintName("fk_PortalGroup2Part_PortalPartId");
            });

            modelBuilder.Entity<PortalGroup2Right>(entity =>
            {
                entity.HasIndex(e => e.PortalGroupId)
                    .HasName("idx_PortalGroup2Right_PortalGroupId");

                entity.HasIndex(e => e.UserRightId)
                    .HasName("idx_PortalGroup2Right_UserRightId");

                entity.Property(e => e.UserRightId)
                    .IsRequired()
                    .HasMaxLength(20);

                entity.HasOne(d => d.PortalGroup)
                    .WithMany(p => p.PortalGroup2Right)
                    .HasForeignKey(d => d.PortalGroupId)
                    .HasConstraintName("fk_PortalGroup2Right_PortalGroupId");

                entity.HasOne(d => d.UserRight)
                    .WithMany(p => p.PortalGroup2Right)
                    .HasForeignKey(d => d.UserRightId)
                    .HasConstraintName("fk_PortalGroup2Right_UserRightId");
            });

            modelBuilder.Entity<PortalGroup2Rubric>(entity =>
            {
                entity.HasIndex(e => e.PortalGroupId)
                    .HasName("idx_PortalGroup2Rubric_PortalGroupId");

                entity.HasIndex(e => e.RubricId)
                    .HasName("idx_PortalGroup2Rubric_RubricId");

                entity.HasOne(d => d.PortalGroup)
                    .WithMany(p => p.PortalGroup2Rubric)
                    .HasForeignKey(d => d.PortalGroupId)
                    .HasConstraintName("fk_PortalGroup2Rubric_PortalGroupId");

                entity.HasOne(d => d.Rubric)
                    .WithMany(p => p.PortalGroup2Rubric)
                    .HasForeignKey(d => d.RubricId)
                    .HasConstraintName("fk_PortalGroup2Rubric_RubricId");
            });

            modelBuilder.Entity<PortalPart>(entity =>
            {
                entity.Property(e => e.PortalPartId)
                    .HasMaxLength(20)
                    .ValueGeneratedNever();

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

            modelBuilder.Entity<PortalUser2Group>(entity =>
            {
                entity.HasIndex(e => e.PortalGroupId)
                    .HasName("idx_PortalUser2Group_PortalGroupId");

                entity.HasIndex(e => e.PortalUserId)
                    .HasName("idx_PortalUser2Group_PortalUserId");

                entity.HasOne(d => d.PortalGroup)
                    .WithMany(p => p.PortalUser2Group)
                    .HasForeignKey(d => d.PortalGroupId)
                    .HasConstraintName("fk_PortalUser2Group_PortalGroupId");
            });

            modelBuilder.Entity<PortalUser2Part>(entity =>
            {
                entity.HasIndex(e => e.PortalPartId)
                    .HasName("idx_PortalUser2Part_PortalPartId");

                entity.HasIndex(e => e.PortalUserId)
                    .HasName("idx_PortalUser2Part_PortalUserId");

                entity.Property(e => e.PortalPartId)
                    .IsRequired()
                    .HasMaxLength(20);

                entity.HasOne(d => d.PortalPart)
                    .WithMany(p => p.PortalUser2Part)
                    .HasForeignKey(d => d.PortalPartId)
                    .HasConstraintName("fk_PortalUser2Part_PortalPartId");
            });

            modelBuilder.Entity<PortalUser2Right>(entity =>
            {
                entity.HasIndex(e => e.PortalUserId)
                    .HasName("idx_PortalUser2Right_PortalUserId");

                entity.HasIndex(e => e.UserRightId)
                    .HasName("idx_PortalUser2Right_UserRightId");

                entity.Property(e => e.UserRightId)
                    .IsRequired()
                    .HasMaxLength(20);

                entity.HasOne(d => d.UserRight)
                    .WithMany(p => p.PortalUser2Right)
                    .HasForeignKey(d => d.UserRightId)
                    .HasConstraintName("fk_PortalUser2Right_UserRightId");
            });

            modelBuilder.Entity<PortalUser2Rubric>(entity =>
            {
                entity.HasIndex(e => e.PortalUserId)
                    .HasName("idx_PortalUser2Rubric_PortalUserId");

                entity.HasIndex(e => e.RubricId)
                    .HasName("idx_PortalUser2Rubric_RubricId");

                entity.HasOne(d => d.PortalUser)
                    .WithMany(p => p.PortalUser2Rubric)
                    .HasForeignKey(d => d.PortalUserId)
                    .HasConstraintName("fk_PortalUser2Rubric_PortalUserId");

                entity.HasOne(d => d.Rubric)
                    .WithMany(p => p.PortalUser2Rubric)
                    .HasForeignKey(d => d.RubricId)
                    .HasConstraintName("fk_PortalUser2Rubric_RubricId");
            });

            modelBuilder.Entity<Property>(entity =>
            {
                entity.Property(e => e.PropertyId)
                    .HasMaxLength(20)
                    .ValueGeneratedNever();

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(e => e.PropertyType)
                    .IsRequired()
                    .HasMaxLength(20);
            });

            modelBuilder.Entity<Rubric>(entity =>
            {
                entity.HasIndex(e => e.PortalPartId)
                    .HasName("idx_Rubric_PortalPartId");

                entity.Property(e => e.PortalPartId)
                    .IsRequired()
                    .HasMaxLength(20);

                entity.Property(e => e.TitleBg)
                    .IsRequired()
                    .HasColumnName("TitleBG");

                entity.Property(e => e.TitleEn)
                    .IsRequired()
                    .HasColumnName("TitleEN");

                entity.HasOne(d => d.PortalPart)
                    .WithMany(p => p.Rubric)
                    .HasForeignKey(d => d.PortalPartId)
                    .HasConstraintName("fk_Rubric_PortalPartId");
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
                    .HasConstraintName("fk_Session_PortalUserId");
            });

            modelBuilder.Entity<Template>(entity =>
            {
                entity.HasIndex(e => e.BlockTypeId)
                    .HasName("idx_Template_BlockTypeId");

                entity.HasIndex(e => e.PortalPartId)
                    .HasName("idx_Template_PortalPartId");

                entity.Property(e => e.BlockTypeId)
                    .IsRequired()
                    .HasMaxLength(20);

                entity.Property(e => e.PortalPartId)
                    .IsRequired()
                    .HasMaxLength(20);

                entity.Property(e => e.TemplateJson).HasColumnName("TemplateJSON");

                entity.HasOne(d => d.BlockType)
                    .WithMany(p => p.Template)
                    .HasForeignKey(d => d.BlockTypeId)
                    .HasConstraintName("fk_PortalPart2Block_BlockTypeId");

                entity.HasOne(d => d.PortalPart)
                    .WithMany(p => p.Template)
                    .HasForeignKey(d => d.PortalPartId)
                    .HasConstraintName("fk_PortalPart2Block_PortalPartId");
            });

            modelBuilder.Entity<Translation>(entity =>
            {
                entity.Property(e => e.TranslationId).ValueGeneratedNever();

                entity.Property(e => e.Content).IsRequired();
            });

            modelBuilder.Entity<UserAction>(entity =>
            {
                entity.HasIndex(e => e.PortalUserId)
                    .HasName("idx_UserAction_PortalUserId");

                entity.Property(e => e.OnTime).HasColumnType("datetime");

                entity.Property(e => e.Title).IsRequired();

                entity.HasOne(d => d.PortalUser)
                    .WithMany(p => p.UserAction)
                    .HasForeignKey(d => d.PortalUserId)
                    .HasConstraintName("fk_UserAction_PortalUserId");
            });

            modelBuilder.Entity<UserRight>(entity =>
            {
                entity.Property(e => e.UserRightId)
                    .HasMaxLength(20)
                    .ValueGeneratedNever();

                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasMaxLength(50);
            });
        }
    }
}
