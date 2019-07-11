﻿using System;
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

        public virtual DbSet<Block> Block { get; set; }
        public virtual DbSet<BlockType> BlockType { get; set; }
        public virtual DbSet<BlockTypeProperty> BlockTypeProperty { get; set; }
        public virtual DbSet<BlockTypePropertyValue> BlockTypePropertyValue { get; set; }
        public virtual DbSet<PortalGroup> PortalGroup { get; set; }
        public virtual DbSet<PortalGroup2Part> PortalGroup2Part { get; set; }
        public virtual DbSet<PortalGroup2Right> PortalGroup2Right { get; set; }
        public virtual DbSet<PortalPart> PortalPart { get; set; }
        public virtual DbSet<PortalUser> PortalUser { get; set; }
        public virtual DbSet<PortalUser2Group> PortalUser2Group { get; set; }
        public virtual DbSet<PortalUser2Part> PortalUser2Part { get; set; }
        public virtual DbSet<PortalUser2Right> PortalUser2Right { get; set; }
        public virtual DbSet<Property> Property { get; set; }
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

            modelBuilder.Entity<Block>(entity =>
            {
                entity.HasIndex(e => e.BlockTypeId)
                    .HasName("idx_Block_BlockTypeId");

                entity.HasIndex(e => e.PortalPartId)
                    .HasName("idx_Block_PortalPartId");

                entity.Property(e => e.BlockTypeId)
                    .IsRequired()
                    .HasMaxLength(20);

                entity.Property(e => e.Jsonvalues).HasColumnName("JSONValues");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(e => e.PortalPartId)
                    .IsRequired()
                    .HasMaxLength(20);

                entity.HasOne(d => d.BlockType)
                    .WithMany(p => p.Block)
                    .HasForeignKey(d => d.BlockTypeId)
                    .HasConstraintName("fk_Block_BlockTypeId");

                entity.HasOne(d => d.PortalPart)
                    .WithMany(p => p.Block)
                    .HasForeignKey(d => d.PortalPartId)
                    .HasConstraintName("fk_Block_PortalPartId");
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

                entity.HasOne(d => d.PortalGroup)
                    .WithMany(p => p.PortalGroup2Right)
                    .HasForeignKey(d => d.PortalGroupId)
                    .HasConstraintName("fk_PortalGroup2Right_PortalGroupId");

                entity.HasOne(d => d.UserRight)
                    .WithMany(p => p.PortalGroup2Right)
                    .HasForeignKey(d => d.UserRightId)
                    .HasConstraintName("fk_PortalGroup2Right_UserRightId");
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

                entity.HasOne(d => d.PortalUser)
                    .WithMany(p => p.PortalUser2Group)
                    .HasForeignKey(d => d.PortalUserId)
                    .HasConstraintName("fk_PortalUser2Group_PortalUserId");
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

                entity.HasOne(d => d.PortalUser)
                    .WithMany(p => p.PortalUser2Part)
                    .HasForeignKey(d => d.PortalUserId)
                    .HasConstraintName("fk_PortalUser2Part_PortalUserId");
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
                    .HasConstraintName("fk_PortalUser2Right_PortalUserId");

                entity.HasOne(d => d.UserRight)
                    .WithMany(p => p.PortalUser2Right)
                    .HasForeignKey(d => d.UserRightId)
                    .HasConstraintName("fk_PortalUser2Right_UserRightId");
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