using Microsoft.EntityFrameworkCore;
using HabaNabatAPI.Models;

namespace HabaNabatAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(
            DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Supplier> Suppliers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // =========================
            // Products
            // =========================
            modelBuilder.Entity<Product>(entity =>
            {
                entity.ToTable("Products");

                entity.HasKey(p => p.ProductID);

                entity.Property(p => p.ProductID)
                    .HasColumnName("ProductID")
                    .ValueGeneratedOnAdd();

                entity.Property(p => p.ProductName)
                    .HasColumnName("ProductName")
                    .HasMaxLength(255)
                    .IsRequired();

                entity.Property(p => p.Weight)
                    .HasColumnName("Weight")
                    .HasMaxLength(100);

                entity.Property(p => p.Price)
                    .HasColumnName("Price")
                    .HasPrecision(18, 2);

                entity.Property(p => p.StockQuantity)
                    .HasColumnName("StockQuantity")
                    .HasPrecision(18, 2);

                entity.Property(p => p.IsActive)
                    .HasColumnName("IsActive");

                entity.Property(p => p.CreatedAt)
                    .HasColumnName("CreatedAt");

                entity.Property(p => p.Description)
                    .HasColumnName("Description");

                entity.Property(p => p.ImageUrl)
                    .HasColumnName("ImageUrl");
            });

            // =========================
            // Customers
            // =========================
            modelBuilder.Entity<Customer>(entity =>
            {
                entity.ToTable("Customers");

                entity.HasKey(c => c.CustomerID);

                entity.Property(c => c.CustomerID)
                    .HasColumnName("CustomerID")
                    .ValueGeneratedOnAdd();

                entity.Property(c => c.CustomerName)
                    .HasColumnName("CustomerName")
                    .HasMaxLength(200)
                    .IsRequired();

                entity.Property(c => c.Phone)
                    .HasColumnName("Phone")
                    .HasMaxLength(50);

                entity.Property(c => c.Email)
                    .HasColumnName("Email")
                    .HasMaxLength(200);

                entity.Property(c => c.Address)
                    .HasColumnName("Address")
                    .HasMaxLength(500);

                entity.Property(c => c.IsActive)
                    .HasColumnName("IsActive")
                    .IsRequired();

                entity.Property(c => c.CreatedAt)
                    .HasColumnName("CreatedAt")
                    .IsRequired();
            });

            // =========================
            // Suppliers
            // =========================
            modelBuilder.Entity<Supplier>(entity =>
            {
                entity.ToTable("Suppliers");

                entity.HasKey(s => s.SupplierID);

                entity.Property(s => s.SupplierID)
                    .HasColumnName("SupplierID")
                    .ValueGeneratedOnAdd();

                entity.Property(s => s.SupplierName)
                    .HasColumnName("SupplierName")
                    .HasMaxLength(200)
                    .IsRequired();

                entity.Property(s => s.Phone)
                    .HasColumnName("Phone")
                    .HasMaxLength(50);

                entity.Property(s => s.Email)
                    .HasColumnName("Email")
                    .HasMaxLength(200);

                entity.Property(s => s.Address)
                    .HasColumnName("Address")
                    .HasMaxLength(500);

                entity.Property(s => s.IsActive)
                    .HasColumnName("IsActive")
                    .IsRequired();

                entity.Property(s => s.CreatedAt)
                    .HasColumnName("CreatedAt")
                    .IsRequired();
            });
        }
    }
}