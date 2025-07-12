using System.Text.Json.Serialization;

namespace AuctionApi.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public decimal BasePrice { get; set; }
        public string Tags { get; set; } = string.Empty;
        public int BranchId { get; set; }
        [JsonIgnore]
        public Branch? Branch { get; set; }
        [JsonIgnore]
        public ICollection<Auction>? Auctions { get; set; }
    }
} 