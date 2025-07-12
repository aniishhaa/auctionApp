using System.Text.Json.Serialization;

namespace AuctionApi.Models
{
    public class Auction
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public Product? Product { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Status { get; set; } = string.Empty;
        public ICollection<Bid>? Bids { get; set; }
    }
} 