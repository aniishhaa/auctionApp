import React, { useState, useEffect, useRef } from "react";
import { api } from "../services/api";
import "./StaffDashboard.css";
import CustomNotification from "../components/CustomNotification";
import ConfirmModal from "../components/ConfirmModal";


function StaffDashboard() {
  const [auctions, setAuctions] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("auctions");
  const [showCreateAuction, setShowCreateAuction] = useState(false);
  const [showCreateProduct, setShowCreateProduct] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notif, setNotif] = useState(null);
  const [confirm, setConfirm] = useState({ show: false, type: '', id: null });

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

  const startTimeRef = useRef();
  const endTimeRef = useRef();

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
      setNotif({ message: "Auction created successfully!", type: "success" });
      loadData();
    } catch (err) {
      setNotif({ message: `Failed to create auction: ${err.message}`, type: "error" });
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await api.createProduct(newProduct);
      setShowCreateProduct(false);
      setNewProduct({ name: "", description: "", basePrice: "", imageUrl: "", tags: "", branchId: 1 });
      setNotif({ message: "Product added successfully!", type: "success" });
      loadData();
    } catch (err) {
      setNotif({ message: `Failed to create product: ${err.message}`, type: "error" });
    }
  };

  const handleDeleteAuction = async (auctionId) => {
    setConfirm({ show: true, type: 'auction', id: auctionId });
  };

  const handleDeleteProduct = async (productId) => {
    setConfirm({ show: true, type: 'product', id: productId });
  };

  const confirmDelete = async () => {
    if (confirm.type === 'auction') {
      try {
        await api.deleteAuction(confirm.id);
        setNotif({ message: "Auction deleted successfully!", type: "success" });
        loadData();
      } catch (err) {
        setNotif({ message: "Failed to delete auction: " + err.message, type: "error" });
      }
    } else if (confirm.type === 'product') {
      try {
        await api.deleteProduct(confirm.id);
        setNotif({ message: "Product deleted successfully!", type: "success" });
        loadData();
      } catch (err) {
        setNotif({ message: "Failed to delete product: " + err.message, type: "error" });
      }
    }
    setConfirm({ show: false, type: '', id: null });
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="staff-dashboard">
      {notif && (
        <CustomNotification
          message={notif.message}
          type={notif.type}
          onClose={() => setNotif(null)}
        />
      )}
      <nav className="staff-nav">
        <h1 style={{ cursor: 'pointer' }} onClick={() => setActiveTab('auctions')}>Staff Dashboard</h1>
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
      <span className="current-time">
        🕒 {currentTime.toLocaleString()} ({Intl.DateTimeFormat().resolvedOptions().timeZone})
      </span>
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
                <div key={auction.id} className="auction-item" style={{ position: 'relative' }}>
                  <button
                    style={{ position: 'absolute', right: '1rem', top: '1rem', background: 'none', border: 'none', color: '#d32f2f', fontSize: '1.3rem', cursor: 'pointer', padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    onClick={() => handleDeleteAuction(auction.id)}
                    title="Delete"
                  >
                    🗑️
                    <span style={{ fontSize: '0.75rem', color: '#d32f2f', marginTop: '0.1rem', fontWeight: 500 }}>Delete</span>
                  </button>
                  <h3>{auction.product?.name ? auction.product.name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ') : "Unknown Product"}</h3>
                  <p>Status: {auction.status}</p>
                  <p>Start: {new Date(auction.startTime).toLocaleString()}</p>
                  <p>End: {new Date(auction.endTime).toLocaleString()}</p>
                  <p>Bids: {auction.bids?.length || 0}</p>
                  <button onClick={() => setSelectedAuction(auction)}>
                    View Bids
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
                <div key={product.id} className="product-item" style={{ position: 'relative' }}>
                  <button
                    style={{ position: 'absolute', right: '1rem', top: '1rem', background: 'none', border: 'none', color: '#d32f2f', fontSize: '1.3rem', cursor: 'pointer', padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    onClick={() => handleDeleteProduct(product.id)}
                    title="Delete"
                  >
                    🗑️
                    <span style={{ fontSize: '0.75rem', color: '#d32f2f', marginTop: '0.1rem', fontWeight: 500 }}>Delete</span>
                  </button>
                  <img src={product.imageUrl || "https://via.placeholder.com/150"} alt={product.name} />
                  <h3>{product.name ? product.name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ') : ''}</h3>
                  <p>{product.description}</p>
                  <p>Base Price: ₹{product.basePrice}</p>
                  <p>Branch: {product.branch?.name || "Unknown"}</p>
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
                style={{ width: '100%', cursor: 'pointer' }}
              />
              <input
                type="datetime-local"
                value={newAuction.endTime}
                onChange={(e) => setNewAuction({...newAuction, endTime: e.target.value})}
                required
                style={{ width: '100%', cursor: 'pointer' }}
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

      {/* Confirm Delete Modal */}
      {confirm.show && (
        <ConfirmModal
          message="Do you want to delete?"
          onConfirm={confirmDelete}
          onCancel={() => setConfirm({ show: false, type: '', id: null })}
        />
      )}
    </div>
  );
}

export default StaffDashboard;
