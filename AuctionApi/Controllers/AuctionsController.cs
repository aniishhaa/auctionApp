using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AuctionApi.Models;
using AuctionApi.Data;

namespace AuctionApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuctionsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public AuctionsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Auction>>> GetAuctions()
        {
            return await _context.Auctions
                .Include(a => a.Product)
                .Include(a => a.Bids)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Auction>> GetAuction(int id)
        {
            var auction = await _context.Auctions
                .Include(a => a.Product)
                .Include(a => a.Bids)
                .FirstOrDefaultAsync(a => a.Id == id);
            
            if (auction == null) return NotFound();
            return auction;
        }

        [HttpGet("active")]
        public async Task<ActionResult<IEnumerable<Auction>>> GetActiveAuctions()
        {
            var now = DateTime.UtcNow;
            return await _context.Auctions
                .Include(a => a.Product)
                .Include(a => a.Bids)
                .Where(a => a.StartTime <= now && a.EndTime >= now && a.Status == "active")
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Auction>> CreateAuction(Auction auction)
        {
            _context.Auctions.Add(auction);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAuction), new { id = auction.Id }, auction);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAuction(int id, Auction auction)
        {
            if (id != auction.Id) return BadRequest();
            _context.Entry(auction).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Auctions.Any(e => e.Id == id))
                    return NotFound();
                else
                    throw;
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAuction(int id)
        {
            var auction = await _context.Auctions.FindAsync(id);
            if (auction == null) return NotFound();
            _context.Auctions.Remove(auction);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
} 