using Microsoft.EntityFrameworkCore;
using AuctionApi.Models;

namespace AuctionApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Branch> Branches { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Auction> Auctions { get; set; }
        public DbSet<Bid> Bids { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            // Add any custom configuration here if needed
            modelBuilder.Entity<Bid>().Property(b => b.BidAmount).HasColumnType("decimal(18,2)");
            modelBuilder.Entity<Product>().Property(p => p.BasePrice).HasColumnType("decimal(18,2)");
        }
    }
} 