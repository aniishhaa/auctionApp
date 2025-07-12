const API_BASE_URL = 'http://localhost:5098/api';

export const api = {
  // Auth
  login: async (email, password) => {
    if (email === "admin@m.com") return { role: "admin", id: 3 };
    if (email === "staff@m.com") return { role: "staff", id: 1 };
    if (email === "customer@m.com") return { role: "customer", id: 2 };
    return { role: "customer", id: 2 }; // fallback to a real user
  },

  // Auctions
  getAuctions: async () => {
    const response = await fetch(`${API_BASE_URL}/auctions`);
    if (!response.ok) throw new Error('Failed to fetch auctions');
    return response.json();
  },

  getActiveAuctions: async () => {
    const response = await fetch(`${API_BASE_URL}/auctions/active`);
    if (!response.ok) throw new Error('Failed to fetch active auctions');
    return response.json();
  },

  getAuction: async (id) => {
    const response = await fetch(`${API_BASE_URL}/auctions/${id}`);
    if (!response.ok) throw new Error('Failed to fetch auction');
    return response.json();
  },

  createAuction: async (auction) => {
    const response = await fetch(`${API_BASE_URL}/auctions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(auction)
    });
    if (!response.ok) throw new Error('Failed to create auction');
    return response.json();
  },

  deleteAuction: async (id) => {
    const response = await fetch(`${API_BASE_URL}/auctions/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Failed to delete auction");
  },

  // Bids
  getBids: async () => {
    const response = await fetch(`${API_BASE_URL}/bids`);
    if (!response.ok) throw new Error('Failed to fetch bids');
    return response.json();
  },

  getBidsByAuction: async (auctionId) => {
    const response = await fetch(`${API_BASE_URL}/bids/auction/${auctionId}`);
    if (!response.ok) throw new Error('Failed to fetch auction bids');
    return response.json();
  },

  getBidsByUser: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/bids/user/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch user bids');
    return response.json();
  },

  createBid: async (bid) => {
    const response = await fetch(`${API_BASE_URL}/bids`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bid)
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }
    return response.json();
  },

  // Products
  getProducts: async () => {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },

  getProduct: async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    return response.json();
  },

  createProduct: async (product) => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    if (!response.ok) throw new Error('Failed to create product');
    return response.json();
  },

  deleteProduct: async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Failed to delete product");
  },

  // Users
  getUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/users`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  getUser: async (id) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  },

  createUser: async (user) => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
    if (!response.ok) throw new Error('Failed to create user');
    return response.json();
  },

  deleteUser: async (id) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Failed to delete user");
  },

  // Branches
  getBranches: async () => {
    const response = await fetch(`${API_BASE_URL}/branches`);
    if (!response.ok) throw new Error('Failed to fetch branches');
    return response.json();
  },

  getBranch: async (id) => {
    const response = await fetch(`${API_BASE_URL}/branches/${id}`);
    if (!response.ok) throw new Error('Failed to fetch branch');
    return response.json();
  },

  createBranch: async (branch) => {
    const response = await fetch(`${API_BASE_URL}/branches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(branch)
    });
    if (!response.ok) throw new Error('Failed to create branch');
    return response.json();
  },

  deleteBranch: async (id) => {
    const response = await fetch(`${API_BASE_URL}/branches/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Failed to delete branch");
  }
}; 