
import React ,{useEffect}from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom"; // Import Navigate
import Navbar from "./Component/Navbar";
import Footer from "./Component/Footer";
import Home from "./Pages/Home";
import Predict from "./Pages/Predict";
import Dashboard from "./Pages/Dashboard";
import UpdateProfile from "./Pages/Updateprofile";
import { toast, ToastContainer } from 'react-toastify';
import Login from "./Pages/login";
import {jwtDecode}from "jwt-decode";

import 'react-toastify/dist/ReactToastify.css';
export default function App() {
  // Check for the TOKEN now instead of the email
  const navigate = useNavigate();
  const isloggedIn = localStorage.getItem("token");
  useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        localStorage.removeItem("token");
        toast.success("Session expired, please log in again.");
        navigate("/");
      }
    } catch (error) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }
}, [navigate]);

  return (
    <div className="app-root">
      
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/predict" element={isloggedIn ? <Predict /> : <Navigate to="/login" />} />
          <Route path="/dashboard" element={isloggedIn ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/login" element={isloggedIn ? <Navigate to="/" /> : <Login />} />
          <Route path="/update-profile" element={isloggedIn ? <UpdateProfile /> : <Navigate to="/login" />} />
        </Routes>
      </main>
      <Footer />
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick pauseOnHover draggable theme="dark" />
    </div>
  );
}