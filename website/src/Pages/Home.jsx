import React from "react";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
export default function Home() {
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem("token");

    function check() {
        if (isLoggedIn) {
            
            navigate('/predict');
        }
        else {
            toast.success("Please Login First");
            navigate('/login');
        }
    }
    function check2() {
        if (isLoggedIn) {
            navigate('/dashboard');
        }
        else {
            toast.success("Please Login First");
            navigate('/login');
        }
    }
    return (
        <>
            <section className="hero">
                <div className="left">
                    <h1>Empowering Health with AI-Powered Cancer Prediction</h1>
                    <p>
                        Our advanced system leverages cutting-edge AI to analyze medical scans,
                        providing accurate and trustworthy predictions for early cancer detection.
                    </p>
                    <p className="cta" onClick={check}>Get Started with a Prediction</p>
                </div>
                <div className="right" style={{ width: 420 }}>
                    <div style={{ background: "#e6eef6", height: 240, borderRadius: 12 }} />
                </div>
            </section>

            <section className="features">
                <h2>Explore Our Core Features</h2>
                <div className="feature-grid">
                    <div className="feature-card card" onClick={check}>
                        <h3>Make a New Prediction</h3>
                        <p style={{ color: "var(--muted)" }}>Upload your medical scan images and receive instant cancer predictions with confidence scores.</p>
                    </div>
                    <div className="feature-card card" onClick={check2}>
                        <h3>Access Your Dashboard</h3>
                        <p style={{ color: "var(--muted)" }}>View your personal information, manage your profile, and review your prediction history.</p>
                    </div>
                    {/* <CardFeature onClick={check} title="Make a New Prediction" desc="Upload your medical scan images and receive instant cancer predictions with confidence scores." />
                    <CardFeature onClick={check2} title="Access Your Dashboard" desc="View your personal information, manage your profile, and review your prediction history." /> */}
                </div>
            </section>
        </>
    );
}