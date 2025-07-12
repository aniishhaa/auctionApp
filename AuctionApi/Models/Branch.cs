using System.Text.Json.Serialization;

namespace AuctionApi.Models
{
    public class Branch
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        [JsonIgnore]
        public ICollection<User>? Users { get; set; }
        [JsonIgnore]
        public ICollection<Product>? Products { get; set; }
    }
} 