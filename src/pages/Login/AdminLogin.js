// AdminLogin.js
import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import auth from "../../firebase-init";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("Admin logged in:", user);
      navigate("/admin-dashboard");
    } catch (error) {
      console.error("Error logging in:", error.message);
      alert("Failed to login. Please check your credentials.");
    }
  };

  return (
    <div className="admin-login-container">
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin}>
        <TextField
          id="email"
          label="Email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <TextField
          id="password"
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button variant="contained" type="submit" fullWidth>
          Login
        </Button>
      </form>

      <div>
        <Link to="/login" style={{ textDecoration: "none" }}>
          Back to User Login
        </Link>
      </div>
    </div>
  );
};

export default AdminLogin;
