
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import main_logo from "../main_logo.png";

export default function Navbar() {
  const navigate = useNavigate();

  
  const isLoggedIn = localStorage.getItem("token");

  // Logout handler now removes the TOKEN
  const handleLogout = () => {
    localStorage.removeItem("token"); // clear the token
    navigate("/");
    window.location.reload();
  };

  return (
    <header className="navbar">
      {/* ... your logo and nav-links JSX remains the same ... */}
      <div className="logo">
        <div style={{ width: 28, height: 28, borderRadius: 6, paddingLeft: "-10px" }}>
          <img src={main_logo} alt="CT-Vision Logo" style={{ width: "180%", height: "100%", borderRadius: 6 }} />
        </div>
        <span style={{ paddingLeft: "20px" }}>CT-Vision</span>
      </div>
      <nav className="nav-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/predict">Predict</NavLink>
        <NavLink to="/dashboard">Dashboard</NavLink>
       
      </nav>

      <div className="nav-actions">
        {isLoggedIn ? ( 
          <button style={{ background: "red", color: "#fff" }} onClick={handleLogout}>
            Logout
          </button>
        ) : (
          
          <>
            <button style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }} onClick={() => navigate("/login")}>
              Login
            </button>
            {/* I've removed the separate /signup button as your login page handles both */}
          </>
        )}
      </div>
    </header>
  );
}