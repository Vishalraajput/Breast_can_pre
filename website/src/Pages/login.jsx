
import "./login.css"
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

export default function Auth({ onAuthSuccess }) {
  const Navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({ name: "", dob: "", blood_group: "", email: "", password: "", profession: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const url = isSignup ? "http://localhost:5000/signup" : "http://localhost:5000/login";
      const payload = isSignup ? formData : { email: formData.email, password: formData.password };

      const res = await axios.post(url, payload);

      
      if (res.data.token) {
        
        localStorage.setItem("token", res.data.token);
        if (isSignup) {
          toast.success("SignUp successful!");
        }
        else{
          toast.success("Login successful!");
        }
        setTimeout(() => {
          Navigate("/");
          window.location.reload();
        }, 1500);
        
      }
    } catch (err) {
 
  console.error("Auth error:", err.response?.data || err.message);
  
  // Aur yeh line user ko UI me sahi error dikhayegi
  setMessage(err.response?.data?.message || "Something went wrong");
}
  };

  // The rest of your JSX form remains exactly the same...
  return (
    <div className="AuthContainer">
      <div className="AuthCard">
        <h2 className="AuthTitle">{isSignup ? "Sign Up" : "Login"}</h2>
        <form onSubmit={handleSubmit} className="AuthForm">
          {isSignup && (
            <>
              <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
            </>
          )}
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <button type="submit">{isSignup ? "Sign Up" : "Login"}</button>
        </form>
        <p className="toggletext">
          {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
          <span onClick={() => setIsSignup(!isSignup)}>{isSignup ? "Login" : "Sign Up"}</span>
        </p>
        {message && (
          <p style={{ color: "red", textAlign: "center", marginTop: "10px" }}>{message}</p>
        )}
      </div>
    </div>
  );
}