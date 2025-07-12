import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import "./StaffDashboard.css";
import CustomNotification from "../components/CustomNotification"; // adjust path as needed
import ConfirmModal from "../components/ConfirmModal";

// Inside your component:

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users");
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showCreateBranch, setShowCreateBranch] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [notif, setNotif] = useState(null);
  const [confirm, setConfirm] = useState({ show: false, type: '', id: null });
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    passwordHash: "",
    role: "customer",
    branchId: null
  });
  const [newBranch, setNewBranch] = useState({
    name: "",
    address: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersData, branchesData] = await Promise.all([
        api.getUsers(),
        api.getBranches()
      ]);
      setUsers(usersData);
      setBranches(branchesData);
    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await api.createUser(newUser);
      setShowCreateUser(false);
      setNewUser({ name: "", email: "", passwordHash: "", role: "customer", branchId: null });
      setNotif({ message: "User added successfully!", type: "success" });
      loadData();
    } catch (err) {
      setNotif({ message: `Failed to create user: ${err.message}`, type: "error" });
    }
  };

  const handleCreateBranch = async (e) => {
    e.preventDefault();
    try {
      await api.createBranch(newBranch);
      setShowCreateBranch(false);
      setNewBranch({ name: "", address: "" });
      setNotif({ message: "Branch added successfully!", type: "success" });
      loadData();
    } catch (err) {
      setNotif({ message: `Failed to create branch: ${err.message}`, type: "error" });
    }
  };

  const handleDeleteUser = (userId) => {
    setConfirm({ show: true, type: 'user', id: userId });
  };
  const handleDeleteBranch = (branchId) => {
    setConfirm({ show: true, type: 'branch', id: branchId });
  };
  const confirmDelete = async () => {
    if (confirm.type === 'user') {
      try {
        await api.deleteUser(confirm.id);
        setNotif({ message: "User deleted successfully!", type: "success" });
        loadData();
      } catch (err) {
        setNotif({ message: "Failed to delete user: " + err.message, type: "error" });
      }
    } else if (confirm.type === 'branch') {
      try {
        await api.deleteBranch(confirm.id);
        setNotif({ message: "Branch deleted successfully!", type: "success" });
        loadData();
      } catch (err) {
        setNotif({ message: "Failed to delete branch: " + err.message, type: "error" });
      }
    }
    setConfirm({ show: false, type: '', id: null });
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return '#d32f2f';
      case 'staff': return '#1976d2';
      case 'customer': return '#388e3c';
      default: return '#666';
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="admin-dashboard">
      {notif && (
        <CustomNotification
          message={notif.message}
          type={notif.type}
          onClose={() => setNotif(null)}
        />
      )}
      <nav className="admin-nav">
        <h1 style={{ cursor: 'pointer' }} onClick={() => setActiveTab('overview')}>Admin Dashboard</h1>
        <div className="nav-tabs">
          <button 
            className={activeTab === "users" ? "active" : ""}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>
          <button 
            className={activeTab === "branches" ? "active" : ""}
            onClick={() => setActiveTab("branches")}
          >
            Branches
          </button>
          <button 
            className={activeTab === "overview" ? "active" : ""}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
        </div>
      </nav>
      <span className="current-time">
        🕒 {currentTime.toLocaleString()} ({Intl.DateTimeFormat().resolvedOptions().timeZone})
      </span>

      <div className="content">
        {activeTab === "users" && (
          <div className="users-section">
            <div className="section-header">
              <h2>Manage Users</h2>
              <button onClick={() => setShowCreateUser(true)}>
                Add New User
              </button>
            </div>
            
            <div className="users-grid">
              {users.map(user => (
                <div key={user.id} className="user-item" style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
                  <button
                    style={{ position: 'absolute', right: '1rem', top: '1rem', background: 'none', border: 'none', color: '#d32f2f', fontSize: '1.3rem', cursor: 'pointer', padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    onClick={() => handleDeleteUser(user.id)}
                    title="Delete"
                  >
                    🗑️
                    <span style={{ fontSize: '0.75rem', color: '#d32f2f', marginTop: '0.1rem', fontWeight: 500 }}>Delete</span>
                  </button>
                  <div className="user-avatar">
                    {user.name && user.name.length > 0 ? user.name[0].toUpperCase() : "?"}
                  </div>
                  <div className="user-info">
                    <h3>{user.name ? user.name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ') : ''}</h3>
                    <p>{user.email}</p>
                    <span 
                      className="role-badge"
                      style={{ backgroundColor: getRoleColor(user.role) }}
                    >
                      {user.role}
                    </span>
                    <p>Branch: {user.branch?.name || "None"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "branches" && (
          <div className="branches-section">
            <div className="section-header">
              <h2>Manage Branches</h2>
              <button onClick={() => setShowCreateBranch(true)}>
                Add New Branch
              </button>
            </div>
            
            <div className="branches-grid">
              {branches.map(branch => (
                <div key={branch.id} className="branch-item" style={{ position: 'relative' }}>
                  <button
                    style={{ position: 'absolute', right: '1rem', top: '1rem', background: 'none', border: 'none', color: '#d32f2f', fontSize: '1.3rem', cursor: 'pointer', padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    onClick={() => handleDeleteBranch(branch.id)}
                    title="Delete"
                  >
                    🗑️
                    <span style={{ fontSize: '0.75rem', color: '#d32f2f', marginTop: '0.1rem', fontWeight: 500 }}>Delete</span>
                  </button>
                  <h3>{branch.name ? branch.name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ') : ''}</h3>
                  <p>{branch.address}</p>
                  <p>Users: {branch.users?.length || 0}</p>
                  <p>Products: {branch.products?.length || 0}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "overview" && (
          <div className="overview-section">
            <h2>System Overview</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Users</h3>
                <p className="stat-number">{users.length}</p>
                <p className="stat-breakdown">
                  Admin: {users.filter(u => u.role === 'admin').length}<br/>
                  Staff: {users.filter(u => u.role === 'staff').length}<br/>
                  Customers: {users.filter(u => u.role === 'customer').length}
                </p>
              </div>
              <div className="stat-card">
                <h3>Total Branches</h3>
                <p className="stat-number">{branches.length}</p>
              </div>
              <div className="stat-card">
                <h3>System Status</h3>
                <p className="stat-status">🟢 Online</p>
                <p>All systems operational</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      {showCreateUser && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New User</h3>
            <form onSubmit={handleCreateUser}>
              <input
                type="text"
                placeholder="Full Name"
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={newUser.passwordHash}
                onChange={(e) => setNewUser({...newUser, passwordHash: e.target.value})}
                required
              />
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                required
              >
                <option value="customer">Customer</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
              <select
                value={newUser.branchId || ""}
                onChange={(e) => setNewUser({...newUser, branchId: e.target.value ? parseInt(e.target.value) : null})}
              >
                <option value="">No Branch</option>
                {branches.map(branch => (
                  <option key={branch.id} value={branch.id}>{branch.name}</option>
                ))}
              </select>
              <div className="modal-buttons">
                <button type="submit">Add User</button>
                <button type="button" onClick={() => setShowCreateUser(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Branch Modal */}
      {showCreateBranch && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New Branch</h3>
            <form onSubmit={handleCreateBranch}>
              <input
                type="text"
                placeholder="Branch Name"
                value={newBranch.name}
                onChange={(e) => setNewBranch({...newBranch, name: e.target.value})}
                required
              />
              <textarea
                placeholder="Address"
                value={newBranch.address}
                onChange={(e) => setNewBranch({...newBranch, address: e.target.value})}
                required
              />
              <div className="modal-buttons">
                <button type="submit">Add Branch</button>
                <button type="button" onClick={() => setShowCreateBranch(false)}>
                  Cancel
                </button>
              </div>
            </form>
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

export default AdminDashboard;
