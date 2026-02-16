import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { User, Mail, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, updateUserProfile, updateUserPassword } = useStore();
    const { showNotification } = useNotification();
    const navigate = useNavigate();

    // If no user, redirect (handled by protected route logic ideally, but here just in case)
    if (!user) {
        navigate('/login');
        return null;
    }

    const [profileData, setProfileData] = useState({
        name: user.name || '',
        email: user.email || ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    const [activeTab, setActiveTab] = useState('profile');
    const [isLoading, setIsLoading] = useState(false);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const res = await updateUserProfile(user.id || user._id, profileData);
        if (res.success) {
            showNotification('Profile updated successfully', 'success');
        } else {
            showNotification(res.message || 'Failed to update profile', 'error');
        }
        setIsLoading(false);
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            showNotification('New passwords do not match', 'error');
            return;
        }
        setIsLoading(true);
        const res = await updateUserPassword(user.id || user._id, {
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword
        });
        if (res.success) {
            showNotification('Password updated successfully', 'success');
            setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
        } else {
            showNotification(res.message || 'Failed to update password', 'error');
        }
        setIsLoading(false);
    };

    return (
        <div className="container py-5 mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="d-flex align-items-center mb-4 pb-4 border-bottom">
                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-black display-5 me-4" style={{ width: '80px', height: '80px' }}>
                            {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="fw-black mb-1">{user.name}</h1>
                            <p className="text-secondary mb-0">{user.email}</p>
                        </div>
                    </div>

                    <ul className="nav nav-pills mb-4 gap-2">
                        <li className="nav-item">
                            <button
                                className={`nav-link rounded-pill px-4 fw-bold ${activeTab === 'profile' ? 'bg-black text-white' : 'bg-light text-secondary'}`}
                                onClick={() => setActiveTab('profile')}
                            >
                                Profile Details
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link rounded-pill px-4 fw-bold ${activeTab === 'password' ? 'bg-black text-white' : 'bg-light text-secondary'}`}
                                onClick={() => setActiveTab('password')}
                            >
                                Security
                            </button>
                        </li>
                    </ul>

                    <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
                        {activeTab === 'profile' && (
                            <form onSubmit={handleProfileUpdate}>
                                <h4 className="fw-bold mb-4">Edit Profile</h4>
                                <div className="mb-3">
                                    <label className="form-label fw-bold small text-secondary">FULL NAME</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-0"><User size={18} /></span>
                                        <input
                                            type="text"
                                            className="form-control bg-light border-0 py-3"
                                            value={profileData.name}
                                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label fw-bold small text-secondary">EMAIL ADDRESS</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-0"><Mail size={18} /></span>
                                        <input
                                            type="email"
                                            className="form-control bg-light border-0 py-3"
                                            value={profileData.email}
                                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary rounded-pill px-4 py-2 fw-bold" disabled={isLoading}>
                                    {isLoading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </form>
                        )}

                        {activeTab === 'password' && (
                            <form onSubmit={handlePasswordUpdate}>
                                <h4 className="fw-bold mb-4">Change Password</h4>
                                <div className="mb-3">
                                    <label className="form-label fw-bold small text-secondary">CURRENT PASSWORD</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-0"><Lock size={18} /></span>
                                        <input
                                            type="password"
                                            className="form-control bg-light border-0 py-3"
                                            value={passwordData.currentPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold small text-secondary">NEW PASSWORD</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-0"><Lock size={18} /></span>
                                        <input
                                            type="password"
                                            className="form-control bg-light border-0 py-3"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label fw-bold small text-secondary">CONFIRM NEW PASSWORD</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-0"><CheckCircle size={18} /></span>
                                        <input
                                            type="password"
                                            className="form-control bg-light border-0 py-3"
                                            value={passwordData.confirmNewPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-dark rounded-pill px-4 py-2 fw-bold" disabled={isLoading}>
                                    {isLoading ? 'Updating...' : 'Update Password'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
