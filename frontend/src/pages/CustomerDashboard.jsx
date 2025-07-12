import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import CustomNotification from "../components/CustomNotification"; // adjust path as needed

// Inside your component:

import "./CustomerDashboard.css";

function CustomerDashboard() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [notif, setNotif] = useState(null);
  // Get logged-in user from localStorage
  const user = JSON.parse(localStorage.getItem("auctionUser"));
  const [currentTime, setCurrentTime] = useState(new Date());
  const [filter, setFilter] = useState('active');

  useEffect(() => {
    loadAuctions();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadAuctions = async () => {
    try {
      setLoading(true);
      const data = await api.getActiveAuctions();
      setAuctions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceBid = async (auctionId) => {
    if (!bidAmount || bidAmount <= 0) {
      setNotif({ message: "Please enter a valid bid amount", type: "error" });
      return;
    }
    if (!user || !user.id) {
      setNotif({ message: "User not found. Please log in again.", type: "error" });
      return;
    }
    try {
      const bid = {
        auctionId: auctionId,
        userId: user.id, // Use the logged-in user's id
        bidAmount: parseFloat(bidAmount)
      };
      await api.createBid(bid);
      setNotif({ message: "Bid placed successfully!", type: "success" });
      setBidAmount("");
      setSelectedAuction(null);
      loadAuctions(); // Refresh auctions
    } catch (err) {
      setNotif({ message: `Failed to place bid: ${err.message}`, type: "error" });
    }
  };

  // Filtered auctions based on filter state
  const filteredAuctions = auctions.filter((auction) => {
    const now = new Date();
    const start = new Date(auction.startTime);
    const end = new Date(auction.endTime);
    const isActive = now >= start && now <= end;
    if (filter === 'active') return isActive;
    if (filter === 'past') return now > end;
    return true;
  }).filter((auction) =>
    auction.product?.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading">Loading auctions...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="dashboard-container">
      {notif && (
        <CustomNotification
          message={notif.message}
          type={notif.type}
          onClose={() => setNotif(null)}
        />
      )}
      {/* Navbar */}
      <nav className="navbar">
        <div className="menu-icon" onClick={() => setSideMenuOpen(!sideMenuOpen)}>
          ☰
        </div>
        <h2 className="logo">Auction</h2>
        <input
          className="search-input"
          type="text"
          placeholder="Search auctions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="bid-button" onClick={() => setSelectedAuction({})}>
          Place Bid
        </button>
      </nav>
      <div style={{
        background: "#e3e9f7",
        color: "#2575fc",
        padding: "0.5rem 2rem",
        fontWeight: 600,
        fontSize: "1.1rem",
        letterSpacing: "1px"
      }}>
        Current App Time: {currentTime.toLocaleString()} ({Intl.DateTimeFormat().resolvedOptions().timeZone})
      </div>
      {/* Side Menu */}
      {sideMenuOpen && (
        <div className="side-menu">
          <ul>
            <li onClick={() => { setFilter('active'); setSideMenuOpen(false); }} style={{ color: filter === 'active' ? '#2575fc' : undefined }}>
              🗂️ Active Bids
            </li>
            <li onClick={() => { setFilter('past'); setSideMenuOpen(false); }} style={{ color: filter === 'past' ? '#2575fc' : undefined }}>
              📜 Past Bids
            </li>
            <li onClick={() => { localStorage.removeItem('auctionUser'); window.location.href = '/'; }}>
              🔓 Logout
            </li>
          </ul>
        </div>
      )}

      {/* Auction List */}
      <div className="auction-list">
        {filteredAuctions.map((auction) => (
          <div className="auction-card" key={auction.id}>
            <img 
              src={auction.product?.imageUrl || "https://via.placeholder.com/200"} 
              alt={auction.product?.name} 
            />
            <div className="card-details">
              <h3>{auction.product?.name || "Unknown Product"}</h3>
              <p>Base Price: ₹{auction.product?.basePrice || 0}</p>
              <p>Current Highest Bid: ₹{auction.bids?.length > 0 ? 
                Math.max(...auction.bids.map(b => b.bidAmount)) : 
                auction.product?.basePrice || 0}</p>
              <p>Ends: {new Date(auction.endTime).toLocaleString()}</p>
              <p>Status: {(() => {
                const now = new Date();
                const start = new Date(auction.startTime);
                const end = new Date(auction.endTime);
                if (now >= start && now <= end) return 'active';
                if (now > end) return 'ended';
                return 'upcoming';
              })()}</p>
              <button 
                onClick={() => setSelectedAuction(auction)}
                disabled={auction.status !== "active"}
              >
                Place Bid
              </button>
            </div>
          </div>
        ))}
        {filteredAuctions.length === 0 && <p>No auctions found.</p>}
      </div>

      {/* Bid Modal */}
      {selectedAuction && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Place Bid</h3>
            <p>Product: {selectedAuction.product?.name}</p>
            <p>Current Highest: ₹{selectedAuction.bids?.length > 0 ? 
              Math.max(...selectedAuction.bids.map(b => b.bidAmount)) : 
              selectedAuction.product?.basePrice || 0}</p>
            <input
              type="number"
              placeholder="Enter bid amount"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              min={selectedAuction.bids?.length > 0 ? 
                Math.max(...selectedAuction.bids.map(b => b.bidAmount)) + 1 : 
                (selectedAuction.product?.basePrice || 0) + 1}
            />
            <div className="modal-buttons">
              <button onClick={() => handlePlaceBid(selectedAuction.id)}>
                Place Bid
              </button>
              <button onClick={() => setSelectedAuction(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerDashboard;
