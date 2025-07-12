import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import "./StaffDashboard.css";

function StaffDashboard() {
  const [auctions, setAuctions] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("auctions");
  const [showCreateAuction, setShowCreateAuction] = useState(false);
  const [showCreateProduct, setShowCreateProduct] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const [newAuction, setNewAuction] = useState({
    productId: "",
    startTime: "",
    endTime: "",
    status: "active"
  });
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    basePrice: "",
    imageUrl: "",
    tags: "",
    branchId: 1
  });
  const [selectedAuction, setSelectedAuction] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [auctionsData, productsData] = await Promise.all([
        api.getAuctions(),
        api.getProducts()
      ]);
      setAuctions(auctionsData);
      setProducts(productsData);
    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAuction = async (e) => {
    e.preventDefault();
    try {
      await api.createAuction(newAuction);
      setShowCreateAuction(false);
      setNewAuction({ productId: "", startTime: "", endTime: "", status: "active" });
      loadData();
    } catch (err) {
      alert(`Failed to create auction: ${err.message}`);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await api.createProduct(newProduct);
      setShowCreateProduct(false);
      setNewProduct({ name: "", description: "", basePrice: "", imageUrl: "", tags: "", branchId: 1 });
      loadData();
    } catch (err) {
      alert(`Failed to create product: ${err.message}`);
    }
  };

  const handleDeleteAuction = async (auctionId) => {
    if (!window.confirm("Are you sure you want to delete this auction?")) return;
    try {
      await api.deleteAuction(auctionId);
      loadData(); // Refresh the list
    } catch (err) {
      alert("Failed to delete auction: " + err.message);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.deleteProduct(productId);
      loadData();
    } catch (err) {
      alert("Failed to delete product: " + err.message);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="staff-dashboard">
      <nav className="staff-nav">
        <h1>Staff Dashboard</h1>
        <div className="nav-tabs">
          <button 
            className={activeTab === "auctions" ? "active" : ""}
            onClick={() => setActiveTab("auctions")}
          >
            Auctions
          </button>
          <button 
            className={activeTab === "products" ? "active" : ""}
            onClick={() => setActiveTab("products")}
          >
            Products
          </button>
        </div>
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

      <div className="content">
        {activeTab === "auctions" && (
          <div className="auctions-section">
            <div className="section-header">
              <h2>Manage Auctions</h2>
              <button onClick={() => setShowCreateAuction(true)}>
                Create New Auction
              </button>
            </div>
            
            <div className="auctions-grid">
              {auctions.map(auction => (
                <div key={auction.id} className="auction-item">
                  <h3>{auction.product?.name || "Unknown Product"}</h3>
                  <p>Status: {auction.status}</p>
                  <p>Start: {new Date(auction.startTime).toLocaleString()}</p>
                  <p>End: {new Date(auction.endTime).toLocaleString()}</p>
                  <p>Bids: {auction.bids?.length || 0}</p>
                  <button onClick={() => setSelectedAuction(auction)}>
                    View Bids
                  </button>
                  <button
                    style={{ background: "#d32f2f", marginLeft: "0.5rem" }}
                    onClick={() => handleDeleteAuction(auction.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div className="products-section">
            <div className="section-header">
              <h2>Manage Products</h2>
              <button onClick={() => setShowCreateProduct(true)}>
                Add New Product
              </button>
            </div>
            
            <div className="products-grid">
              {products.map(product => (
                <div key={product.id} className="product-item">
                  <img src={product.imageUrl || "https://via.placeholder.com/150"} alt={product.name} />
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <p>Base Price: ₹{product.basePrice}</p>
                  <p>Branch: {product.branch?.name || "Unknown"}</p>
                  <button
                    style={{ background: "#d32f2f", marginTop: "0.5rem" }}
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Create Auction Modal */}
      {showCreateAuction && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Create New Auction</h3>
            <form onSubmit={handleCreateAuction}>
              <select
                value={newAuction.productId}
                onChange={(e) => setNewAuction({...newAuction, productId: parseInt(e.target.value)})}
                required
              >
                <option value="">Select Product</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>{product.name}</option>
                ))}
              </select>
              <input
                type="datetime-local"
                value={newAuction.startTime}
                onChange={(e) => setNewAuction({...newAuction, startTime: e.target.value})}
                required
              />
              <input
                type="datetime-local"
                value={newAuction.endTime}
                onChange={(e) => setNewAuction({...newAuction, endTime: e.target.value})}
                required
              />
              <div className="modal-buttons">
                <button type="submit">Create Auction</button>
                <button type="button" onClick={() => setShowCreateAuction(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Product Modal */}
      {showCreateProduct && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New Product</h3>
            <form onSubmit={handleCreateProduct}>
              <input
                type="text"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                required
              />
              <textarea
                placeholder="Description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                required
              />
              <input
                type="number"
                placeholder="Base Price"
                value={newProduct.basePrice}
                onChange={(e) => setNewProduct({...newProduct, basePrice: parseFloat(e.target.value)})}
                required
              />
              <input
                type="url"
                placeholder="Image URL"
                value={newProduct.imageUrl}
                onChange={(e) => setNewProduct({...newProduct, imageUrl: e.target.value})}
              />
              <input
                type="text"
                placeholder="Tags (comma separated)"
                value={newProduct.tags}
                onChange={(e) => setNewProduct({...newProduct, tags: e.target.value})}
              />
              <div className="modal-buttons">
                <button type="submit">Add Product</button>
                <button type="button" onClick={() => setShowCreateProduct(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedAuction && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Bids for {selectedAuction.product?.name || "Auction"}</h3>
            {selectedAuction.bids && selectedAuction.bids.length > 0 ? (
              <ul>
                {selectedAuction.bids.map(bid => (
                  <li key={bid.id}>
                    Amount: ₹{bid.bidAmount} | User ID: {bid.userId} | Time: {new Date(bid.bidTime).toLocaleString()}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No bids yet.</p>
            )}
            <button onClick={() => setSelectedAuction(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default StaffDashboard;
