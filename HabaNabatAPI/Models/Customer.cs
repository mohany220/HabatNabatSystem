namespace HabaNabatAPI.Models
{
    public class Customer
    {
        public int CustomerID { get; set; }

        public string CustomerName { get; set; } = string.Empty;

        public string? Phone { get; set; }

        public string? Email { get; set; }

        public string? Address { get; set; }

        public bool IsActive { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}