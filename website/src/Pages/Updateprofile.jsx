import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api'; 
import "./Updateprofile.css"; 
import { toast } from 'react-toastify';
export default function UpdateProfile() {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        dob: '',
        blood_group: '',
        profession: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/dashboard');
                const userData = res.data;
                setFormData({
                    name: userData.name || '',
                    dob: userData.dob || '',
                    blood_group: userData.blood_group || '',
                    profession: userData.profession || ''
                });
            } catch (err) {
                setError('Could not fetch your profile data.');
                console.error("Fetch profile error:", err);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const res = await api.put('/update-profile', formData);
            toast.success(res.data.message);
            setTimeout(() => {
                navigate('/dashboard');
            }, 1000);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed. Please try again.');
            console.error("Update profile error:", err);
        }
    };

    return (
        <div className="update-profile-container">
            <h2>Update Your Profile</h2>
            <p>You can change your details anytime.</p>
            <form onSubmit={handleSubmit} className="update-form">
                <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="dob">Date of Birth</label>
                    <input type="date" id="dob" name="dob" value={formData.dob} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="blood_group">Blood Group</label>
                    <input type="text" id="blood_group" name="blood_group" value={formData.blood_group} onChange={handleChange} placeholder="e.g., A+" />
                </div>
                <div className="form-group">
                    <label htmlFor="profession">Profession</label>
                    <input type="text" id="profession" name="profession" value={formData.profession} onChange={handleChange} />
                </div>
                <button type="submit" className="submit-btn">Save Changes</button>
            </form>
           
        </div>
    );
}