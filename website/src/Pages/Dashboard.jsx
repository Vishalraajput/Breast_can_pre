import React, { useEffect, useState } from "react";
import api from "../api/api";
import "./Dashboard.css"; // The CSS file remains the same
import { useNavigate } from "react-router-dom";
export default function Dashboard() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        async function loadDashboardData() {
            try {
                const response = await api.get("/dashboard");
                setUser(response.data);
            } catch (e) {
                console.error("Error loading dashboard data:", e);
                setUser(null);
            }
        }
        loadDashboardData();
    }, []);

    if (!user) {
        return <div className="dashboard-container"><h2>Login First or Check Your Network</h2></div>;
    }

    return (
        <div className="dashboard-container">
            <h2>Welcome, {user.name}!</h2>

            <section className="dashboard-section">
                <h3>Your Details</h3>
                <div className="details-grid">
                    <div className="detail-card">Full Name<br /><strong>{user.name}</strong></div>
                    <div className="detail-card">Date of Birth<br /><strong>{user.dob}</strong></div>
                    <div className="detail-card">Email<br /><strong>{user.email}</strong></div>
                    <div className="detail-card">Blood Group<br /><strong>{user.blood_group}</strong></div>
                </div>
            </section>
            <button className="update-profile-button" onClick={() => navigate('/update-profile')}>Update Profile</button>
            <section className="dashboard-section">
                <h3>Previous Predictions</h3>
                {user.history && user.history.length > 0 ? (<>
                <div className="predictions-card">
                        <table className="predictions-table">
                            <thead>
                            <tr>
                                <th>Date</th>
                                <th>Image Filename</th>
                                <th>Result</th>
                                <th>Confidence</th>
                            </tr>
                        </thead>
                        <tbody>

                            {user.history.map((p, index) =>(
                                    <tr key={p.date || index}>
                                        <td>{new Date(p.date).toLocaleDateString()}</td>
                                        <td>{p.image_url || "N/A"}</td>
                                        <td>
                                            <span className={`badge ${p.result.toLowerCase() === 'benign' ? 'badge-benign' : 'badge-malignant'}`}>
                                                {p.result}
                                            </span>
                                        </td>
                                        <td>{(p.predict * 100).toFixed(1)}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                </>):(  <p style={{textAlign: "center"}}>No predictions yet.</p>)}
                    
            </section>
        </div>
    );
}