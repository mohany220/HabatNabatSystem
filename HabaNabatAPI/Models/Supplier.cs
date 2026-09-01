namespace HabaNabatAPI.Models
{
    public class Supplier
    {
        public int SupplierID { get; set; }

        public string SupplierName { get; set; } = string.Empty;

        public string? Phone { get; set; }

        public string? Email { get; set; }

        public string? Address { get; set; }

        public bool IsActive { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}