import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./InstituteLogin.css";

export default function InstituteLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Added for better error handling
  const navigate = useNavigate();

  const handleLogin = async () => {
    // Clear any previous error messages
    setError("");

    // Basic validation
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5700/api/institutes/login", { email, password });

      // Store login details in localStorage
      localStorage.setItem("institute", JSON.stringify(res.data));

      // Navigate to the Institute component
      navigate("/institute");
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
      setError(errorMessage);
    }
  };

  return (
    <div className="login-container">
      <h2>Institute Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button onClick={handleLogin}>Login</button>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}