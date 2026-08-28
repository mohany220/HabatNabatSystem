namespace HabaNabatAPI.Models
{
    public class Product
    {
       public int ProductID { get; set; }

public string ProductName { get; set; } = string.Empty;

public string? Weight { get; set; }

public decimal Price { get; set; }

public decimal StockQuantity { get; set; }

public bool IsActive { get; set; }

public DateTime CreatedAt { get; set; }

public string? Description { get; set; }

public string? ImageUrl { get; set; }
    }
}