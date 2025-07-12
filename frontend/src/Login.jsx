import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "./services/api";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await api.login(email, password);
    // Store the user object in localStorage
    localStorage.setItem("auctionUser", JSON.stringify(response));
    // Redirect based on role
    switch (response.role) {
      case "admin":
        navigate("/admin/users");
        break;
      case "staff":
        navigate("/staff/auctions");
        break;
      default:
        navigate("/dashboard");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        <p>Try emails: admin@belc.com / staff@belc.com / ansstaff@belc.com</p>
      </form>
    </div>
  );
}

export default Login;
