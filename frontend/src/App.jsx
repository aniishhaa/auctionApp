import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import CustomerDashboard from "./pages/CustomerDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<CustomerDashboard />} />
      <Route path="/staff/auctions" element={<StaffDashboard />} />
      <Route path="/admin/users" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;
