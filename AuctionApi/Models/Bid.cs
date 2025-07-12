using System.Text.Json.Serialization;

namespace AuctionApi.Models
{
    public class Bid
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        [JsonIgnore]
        public User? User { get; set; }
        public int AuctionId { get; set; }
        [JsonIgnore]
        public Auction? Auction { get; set; }
        public decimal BidAmount { get; set; }
        public DateTime BidTime { get; set; }
    }
} 