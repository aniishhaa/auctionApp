using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AuctionApi.Models;
using AuctionApi.Data;

namespace AuctionApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BidsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public BidsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Bid>>> GetBids()
        {
            return await _context.Bids
                .Include(b => b.User)
                .Include(b => b.Auction)
                .ThenInclude(a => a.Product)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Bid>> GetBid(int id)
        {
            var bid = await _context.Bids
                .Include(b => b.User)
                .Include(b => b.Auction)
                .ThenInclude(a => a.Product)
                .FirstOrDefaultAsync(b => b.Id == id);
            
            if (bid == null) return NotFound();
            return bid;
        }

        [HttpGet("auction/{auctionId}")]
        public async Task<ActionResult<IEnumerable<Bid>>> GetBidsByAuction(int auctionId)
        {
            return await _context.Bids
                .Include(b => b.User)
                .Where(b => b.AuctionId == auctionId)
                .OrderByDescending(b => b.BidAmount)
                .ToListAsync();
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Bid>>> GetBidsByUser(int userId)
        {
            return await _context.Bids
                .Include(b => b.Auction)
                .ThenInclude(a => a.Product)
                .Where(b => b.UserId == userId)
                .OrderByDescending(b => b.BidTime)
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Bid>> CreateBid(Bid bid)
        {
            // Validate auction is active
            var auction = await _context.Auctions
                .Include(a => a.Product)
                .FirstOrDefaultAsync(a => a.Id == bid.AuctionId);
            if (auction == null) return BadRequest("Auction not found");

            if (auction.Status != "active" || auction.EndTime < DateTime.UtcNow)
                return BadRequest("Auction is not active");

            // Check if bid is higher than current highest bid or base price
            var currentHighestBid = await _context.Bids
                .Where(b => b.AuctionId == bid.AuctionId)
                .OrderByDescending(b => b.BidAmount)
                .FirstOrDefaultAsync();

            if (currentHighestBid != null)
            {
                if (bid.BidAmount <= currentHighestBid.BidAmount)
                    return BadRequest("Bid must be higher than current highest bid");
            }
            else
            {
                // No bids yet, must be higher than base price
                if (bid.BidAmount <= (auction.Product?.BasePrice ?? 0))
                    return BadRequest("Bid must be higher than the base price");
            }

            bid.BidTime = DateTime.UtcNow;
            _context.Bids.Add(bid);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBid), new { id = bid.Id }, bid);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBid(int id)
        {
            var bid = await _context.Bids.FindAsync(id);
            if (bid == null) return NotFound();
            _context.Bids.Remove(bid);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
} 