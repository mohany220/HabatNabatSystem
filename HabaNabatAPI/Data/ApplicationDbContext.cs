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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

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
        }
    }
}