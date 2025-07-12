using System.Text.Json.Serialization;

namespace AuctionApi.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public int? BranchId { get; set; }
        [JsonIgnore]
        public Branch? Branch { get; set; }
        [JsonIgnore]
        public ICollection<Bid>? Bids { get; set; }
    }
} 