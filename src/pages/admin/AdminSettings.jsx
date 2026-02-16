import React, { useState, useEffect, useRef } from 'react';
import {
    Settings as SettingsIcon,
    Bell,
    Lock,
    Save,
    User as UserIcon,
    Info,
    Shield
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useNotification } from '../../context/NotificationContext';
import '../../css/admin/AdminLayout.css';

const AdminSettings = () => {
    const { user, settings: globalSettings, updateSettings, updateAdminProfile, updateAdminPassword, fetchSecurityLogs, loading: globalLoading } = useStore();
    const { showNotification } = useNotification();
    const [activeTab, setActiveTab] = useState('general');
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [securityLogs, setSecurityLogs] = useState([]);
    const [isLoadingLogs, setIsLoadingLogs] = useState(false);
    const fileInputRef = useRef(null);

    // Profile state
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        bio: user?.bio || '',
        twoFactorEnabled: user?.twoFactorEnabled || false
    });

    const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);

    // Security state
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Local state for form editing
    const [settings, setSettings] = useState({
        storeName: '',
        storeEmail: '',
        currency: '',
        timezone: '',
        notifications: {
            sales: true,
            reports: true,
            stock: false,
            signups: false
        },
        sessionTimeout: 15
    });

    // Initialize local state
    useEffect(() => {
        if (globalSettings) setSettings(globalSettings);
        if (user) setProfileData({
            name: user.name,
            bio: user.bio || '',
            twoFactorEnabled: user.twoFactorEnabled || false
        });

        if (activeTab === 'security') {
            loadLogs();
        }

        // Sync local loading with global loading
        setIsLoading(globalLoading);
    }, [globalSettings, user, activeTab, globalLoading]);

    const loadLogs = async () => {
        setIsLoadingLogs(true);
        const logs = await fetchSecurityLogs();
        setSecurityLogs(logs);
        setIsLoadingLogs(false);
    };

    const handleSettingsChange = (field, value) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const toggleNotification = (key) => {
        setSettings(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [key]: !prev.notifications[key]
            }
        }));
    };

    const handlePasswordUpdate = async () => {
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            showNotification('Please fill all password fields', 'error');
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showNotification('Passwords do not match', 'error');
            return;
        }

        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!re.test(passwordData.newPassword)) {
            showNotification('Password must be at least 8 chars with uppercase, lowercase, number & special char', 'error');
            return;
        }

        setIsSaving(true);
        const result = await updateAdminPassword(user.id, passwordData);
        if (result.success) {
            showNotification('Password updated successfully', 'success');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } else {
            showNotification(result.message || 'Failed to update password', 'error');
        }
        setIsSaving(false);
    };

    const handleSave = async () => {
        setIsSaving(true);
        let success = false;
        let message = 'Settings updated successfully';

        // 1. General Settings & Notifications & Session Timeout (which is in security tab)
        if (activeTab === 'general' || activeTab === 'notifications' || activeTab === 'security') {
            const result = await updateSettings(settings);
            if (result.success) success = true;
        }

        // 2. Profile Update
        if (activeTab === 'profile') {
            const result = await updateAdminProfile(user.id || user._id, {
                ...profileData,
                avatar: avatarPreview
            });
            if (result.success) success = true;
            else message = result.message || 'Profile update failed';
        }

        // 3. Security (Password Update) - Only if password fields are filled
        if (activeTab === 'security' && passwordData.newPassword) {
            if (passwordData.newPassword !== passwordData.confirmPassword) {
                showNotification('Passwords do not match', 'error');
                setIsSaving(false);
                return;
            }
            const pwdResult = await updateAdminPassword(user.id, passwordData);
            if (pwdResult.success) {
                success = true;
                message = 'Security settings and password updated';
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                success = false;
                message = pwdResult.message || 'Password update failed';
            }
        }

        if (success) {
            showNotification(message, 'success');
        } else {
            showNotification(message || 'Failed to update settings', 'error');
        }
        setIsSaving(false);
    };

    const handlePhotoClick = () => {
        if (fileInputRef.current) fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 8000000) {
                showNotification('File is too large. Max size is 800KB', 'error');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
                showNotification('Photo uploaded successfully', 'success');
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="admin-settings-container animate-fade-in">
            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
            />
            <div className="page-header d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h3 fw-black mb-1">System Settings</h1>
                    <p className="text-secondary small">Comprehensive control panel for your store and admin profile.</p>
                </div>
                {!isLoading && (
                    <button
                        className="btn btn-primary d-flex align-items-center gap-2 px-4 rounded-pill shadow-sm"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <span className="spinner-border spinner-border-sm" role="status"></span>
                        ) : (
                            <Save size={18} />
                        )}
                        <span>{isSaving ? 'Processing...' : (activeTab === 'security' && passwordData.newPassword ? 'Update Security & Password' : 'Save Changes')}</span>
                    </button>
                )}
            </div>

            {isLoading ? (
                <div className="d-flex flex-column align-items-center justify-content-center p-5 bg-white rounded-4 shadow-sm">
                    <div className="spinner-border text-primary mb-3" role="status"></div>
                    <p className="text-secondary fw-bold">Connecting to secure server...</p>
                </div>
            ) : (
                <div className="row g-4">
                    {/* Sidebar Navigation for Settings */}
                    <div className="col-lg-3 col-md-4">
                        <div className="content-card overflow-hidden border-0 shadow-sm">
                            <div className="list-group list-group-flush">
                                {[
                                    { id: 'general', label: 'General', icon: SettingsIcon },
                                    { id: 'storefront', label: 'Storefront', icon: SettingsIcon },
                                    { id: 'profile', label: 'Admin Profile', icon: UserIcon },
                                    { id: 'security', label: 'Security', icon: Lock },
                                    { id: 'notifications', label: 'Notifications', icon: Bell },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        className={`list-group-item list-group-item-action border-0 p-3 d-flex align-items-center gap-3 ${activeTab === tab.id ? 'active' : 'bg-transparent text-secondary'}`}
                                        onClick={() => setActiveTab(tab.id)}
                                        style={{ transition: 'all 0.2s ease' }}
                                    >
                                        <tab.icon size={18} className={activeTab === tab.id ? 'text-white' : 'text-primary'} />
                                        <span className="fw-bold small text-uppercase letter-spacing-1">{tab.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="content-card mt-3 p-3 bg-light border-0">
                            <div className="d-flex align-items-center gap-2 text-primary mb-2">
                                <Info size={16} />
                                <span className="small fw-bold">Tip</span>
                            </div>
                            <p className="smaller text-secondary mb-0">Changes to store currency or timezone may affect order history reports.</p>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="col-lg-9 col-md-8">
                        <div className="content-card p-4 border-0 shadow-sm" style={{ minHeight: '500px' }}>
                            {activeTab === 'general' && (
                                <div className="animate-fade-in">
                                    <div className="d-flex align-items-center gap-3 mb-4">
                                        <div className="p-2 bg-primary-subtle rounded-3 text-primary">
                                            <SettingsIcon size={24} />
                                        </div>
                                        <h4 className="mb-0 fw-bold">General Store Configuration</h4>
                                    </div>
                                    <div className="row g-4">
                                        <div className="col-md-6">
                                            <label className="form-label text-secondary smaller fw-bold uppercase letter-spacing-1">Store Display Name</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-lg border-2"
                                                value={settings.storeName}
                                                onChange={(e) => handleSettingsChange('storeName', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label text-secondary smaller fw-bold uppercase letter-spacing-1">Official Contact Email</label>
                                            <input
                                                type="email"
                                                className="form-control form-control-lg border-2"
                                                value={settings.storeEmail}
                                                onChange={(e) => handleSettingsChange('storeEmail', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label text-secondary smaller fw-bold uppercase letter-spacing-1">Default Currency</label>
                                            <select
                                                className="form-select form-select-lg border-2"
                                                value={settings.currency}
                                                onChange={(e) => handleSettingsChange('currency', e.target.value)}
                                            >
                                                <option>INR (₹) - Indian Rupee</option>
                                                <option>USD ($) - US Dollar</option>
                                                <option>EUR (€) - Euro</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label text-secondary smaller fw-bold uppercase letter-spacing-1">Regional Timezone</label>
                                            <select
                                                className="form-select form-select-lg border-2"
                                                value={settings.timezone}
                                                onChange={(e) => handleSettingsChange('timezone', e.target.value)}
                                            >
                                                <option>(GMT+05:30) IST - Kolkata</option>
                                                <option>(GMT+00:00) UTC - Universal</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'profile' && (
                                <div className="animate-fade-in">
                                    <div className="d-flex align-items-center gap-3 mb-4">
                                        <div className="p-2 bg-success-subtle rounded-3 text-success">
                                            <UserIcon size={24} />
                                        </div>
                                        <h4 className="mb-0 fw-bold">Admin Profile Settings</h4>
                                    </div>
                                    <div className="d-flex align-items-center gap-4 mb-4 pb-4 border-bottom">
                                        {avatarPreview ? (
                                            <img src={avatarPreview} alt="Avatar" className="rounded-circle shadow-lg object-fit-cover" style={{ width: '80px', height: '80px' }} />
                                        ) : (
                                            <div className="bg-primary text-white display-4 rounded-circle d-flex align-items-center justify-content-center shadow-lg" style={{ width: '80px', height: '80px', fontWeight: 900 }}>
                                                {user?.name?.charAt(0) || 'A'}
                                            </div>
                                        )}
                                        <div>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm border-0 fw-bold p-0 mb-1"
                                                value={profileData.name}
                                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                            />
                                            <p className="text-secondary small mb-2">{user?.email || 'admin@store.com'}</p>
                                            <button className="btn btn-outline-primary btn-sm px-3 rounded-pill fw-bold" onClick={handlePhotoClick}>Update Photo</button>
                                        </div>
                                    </div>
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <label className="form-label text-secondary smaller fw-bold uppercase letter-spacing-1">Professional Bio</label>
                                            <textarea
                                                className="form-control border-2"
                                                rows="4"
                                                placeholder="Briefly describe your role or leave a personal note..."
                                                value={profileData.bio}
                                                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'security' && (
                                <div className="animate-fade-in">
                                    <div className="d-flex align-items-center gap-3 mb-4">
                                        <div className="p-2 bg-danger-subtle rounded-3 text-danger">
                                            <Shield size={24} />
                                        </div>
                                        <h4 className="mb-0 fw-bold">Platform Security</h4>
                                    </div>
                                    <div className="p-3 bg-light rounded-4 mb-4 d-flex align-items-center justify-content-between border border-danger border-opacity-10">
                                        <div>
                                            <h6 className="mb-1 fw-bold">Two-Factor Authentication (2FA)</h6>
                                            <p className="text-secondary smaller mb-0">Secure your admin account with an additional security layer.</p>
                                        </div>
                                        <div className="form-switch form-check-lg">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                style={{ width: '3em', height: '1.5em' }}
                                                checked={profileData.twoFactorEnabled}
                                                onChange={(e) => setProfileData({ ...profileData, twoFactorEnabled: e.target.checked })}
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-2">
                                        <h5 className="h6 fw-black text-uppercase letter-spacing-1 mb-3">Update Login Credentials</h5>
                                        <div className="d-grid gap-3 mb-3">
                                            <input
                                                type="password"
                                                className="form-control border-2 py-2"
                                                placeholder="Current Password"
                                                value={passwordData.currentPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                            />
                                            <div>
                                                <input
                                                    type="password"
                                                    className="form-control border-2 py-2"
                                                    placeholder="New Password"
                                                    value={passwordData.newPassword}
                                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                />
                                                {passwordData.newPassword && (
                                                    <div className="mt-2 d-flex gap-1" style={{ height: '4px' }}>
                                                        {[1, 2, 3, 4].map((i) => {
                                                            const strength = passwordData.newPassword.length >= 8 ?
                                                                (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(passwordData.newPassword) ? 4 : 2) : 1;
                                                            return (
                                                                <div
                                                                    key={i}
                                                                    className="flex-fill rounded-pill"
                                                                    style={{
                                                                        backgroundColor: i <= strength ? (strength > 3 ? '#10b981' : (strength > 1 ? '#f59e0b' : '#ef4444')) : '#e5e7eb'
                                                                    }}
                                                                />
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                            <input
                                                type="password"
                                                className="form-control border-2 py-2"
                                                placeholder="Confirm Password"
                                                value={passwordData.confirmPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            />
                                        </div>
                                        <button
                                            className="btn btn-dark w-100 rounded-3 fw-bold py-2 d-flex align-items-center justify-content-center gap-2"
                                            onClick={handlePasswordUpdate}
                                            disabled={isSaving || !passwordData.newPassword}
                                        >
                                            {isSaving ? <span className="spinner-border spinner-border-sm" /> : <Shield size={18} />}
                                            Update Administrative Password
                                        </button>
                                    </div>
                                    <div className="mt-4 pt-4 border-top">
                                        <h5 className="h6 fw-black text-uppercase letter-spacing-1 mb-3">Session Management</h5>
                                        <div className="p-3 bg-light rounded-4 d-flex align-items-center justify-content-between border border-primary border-opacity-10">
                                            <div>
                                                <h6 className="mb-1 fw-bold">Admin Inactivity Timeout</h6>
                                                <p className="text-secondary smaller mb-0">Automatically log out after specified minutes of inactivity.</p>
                                            </div>
                                            <div className="d-flex align-items-center gap-2">
                                                <input
                                                    type="number"
                                                    className="form-control form-control-sm text-center fw-bold"
                                                    style={{ width: '80px' }}
                                                    value={settings.sessionTimeout}
                                                    onChange={(e) => handleSettingsChange('sessionTimeout', parseInt(e.target.value) || 1)}
                                                    min="1"
                                                    max="1440"
                                                />
                                                <span className="smaller fw-bold text-secondary">MINS</span>
                                            </div>
                                        </div>
                                        <div className="mt-5 pt-4 border-top">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h5 className="h6 fw-black text-uppercase letter-spacing-1 mb-0">Security Audit Log</h5>
                                                <button className="btn btn-link btn-sm text-primary fw-bold text-decoration-none p-0" onClick={loadLogs} disabled={isLoadingLogs}>
                                                    {isLoadingLogs ? 'Refreshing...' : 'Refresh Logs'}
                                                </button>
                                            </div>
                                            <div className="bg-light rounded-4 overflow-hidden border">
                                                <div className="table-responsive" style={{ maxHeight: '300px' }}>
                                                    <table className="table table-sm table-borderless mb-0">
                                                        <thead>
                                                            <tr className="bg-white border-bottom">
                                                                <th className="ps-3 py-2 smaller text-secondary uppercase">Event</th>
                                                                <th className="py-2 smaller text-secondary uppercase">Status</th>
                                                                <th className="py-2 smaller text-secondary uppercase">Time</th>
                                                                <th className="pe-3 py-2 smaller text-secondary uppercase text-end">Severity</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {securityLogs.length > 0 ? securityLogs.map((log, i) => (
                                                                <tr key={i} className="border-bottom last-no-border">
                                                                    <td className="ps-3 py-2">
                                                                        <div className="fw-bold smaller text-dark">{log.event.replace(/_/g, ' ')}</div>
                                                                        <div className="smaller text-secondary text-truncate" style={{ maxWidth: '200px' }}>{log.details || log.userEmail}</div>
                                                                    </td>
                                                                    <td className="py-2">
                                                                        <span className={`badge rounded-pill smaller ${log.status === 'SUCCESS' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                                                                            {log.status}
                                                                        </span>
                                                                    </td>
                                                                    <td className="py-2 smaller text-secondary">
                                                                        {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                    </td>
                                                                    <td className="pe-3 py-2 text-end">
                                                                        <span className={`smaller fw-bold ${log.severity === 'CRITICAL' || log.severity === 'HIGH' ? 'text-danger' : 'text-secondary'}`}>
                                                                            {log.severity}
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            )) : (
                                                                <tr>
                                                                    <td colSpan="4" className="text-center py-4 text-secondary smaller">No security events recorded</td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'notifications' && (
                                <div className="animate-fade-in">
                                    <div className="d-flex align-items-center gap-3 mb-4">
                                        <div className="p-2 bg-info-subtle rounded-3 text-info">
                                            <Bell size={24} />
                                        </div>
                                        <h4 className="mb-0 fw-bold">Notification Preferences</h4>
                                    </div>
                                    <div className="d-grid gap-3">
                                        {[
                                            { key: 'sales', title: 'New Sale Transactions', desc: 'Instant email for every completed checkout' },
                                            { key: 'reports', title: 'Weekly Performance Report', desc: 'Summary of store activity every Monday' },
                                            { key: 'stock', title: 'Critical Stock Alerts', desc: 'Notify when items fall below 5 units' },
                                            { key: 'signups', title: 'New Customer Signups', desc: 'Alert for every new account created' }
                                        ].map((pref) => (
                                            <div key={pref.key} className="d-flex justify-content-between align-items-center p-3 border rounded-3 hover-bg-light transition-all">
                                                <div>
                                                    <div className="fw-bold small">{pref.title}</div>
                                                    <div className="smaller text-secondary">{pref.desc}</div>
                                                </div>
                                                <div className="form-check form-switch">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        checked={settings.notifications[pref.key]}
                                                        onChange={() => toggleNotification(pref.key)}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'storefront' && (
                                <div className="animate-fade-in">
                                    <div className="d-flex align-items-center gap-3 mb-4">
                                        <div className="p-2 bg-warning-subtle rounded-3 text-warning">
                                            <SettingsIcon size={24} />
                                        </div>
                                        <h4 className="mb-0 fw-bold">Storefront Customization</h4>
                                    </div>
                                    <div className="row g-4">
                                        <div className="col-12">
                                            <label className="form-label text-secondary smaller fw-bold uppercase letter-spacing-1">Hero Title</label>
                                            <input
                                                type="text"
                                                className="form-control form-control-lg border-2"
                                                value={settings.heroTitle || ''}
                                                onChange={(e) => handleSettingsChange('heroTitle', e.target.value)}
                                                placeholder="STEP INTO THE FUTURE."
                                            />
                                            <p className="smaller text-secondary mt-1">Use \n for new lines.</p>
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label text-secondary smaller fw-bold uppercase letter-spacing-1">Hero Subtitle</label>
                                            <textarea
                                                className="form-control border-2"
                                                rows="3"
                                                value={settings.heroSubtitle || ''}
                                                onChange={(e) => handleSettingsChange('heroSubtitle', e.target.value)}
                                            ></textarea>
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label text-secondary smaller fw-bold uppercase letter-spacing-1">Hero Image URL</label>
                                            <input
                                                type="url"
                                                className="form-control border-2"
                                                value={settings.heroImage || ''}
                                                onChange={(e) => handleSettingsChange('heroImage', e.target.value)}
                                            />
                                            {settings.heroImage && (
                                                <div className="mt-3 p-2 border rounded-3 bg-light">
                                                    <p className="smaller fw-bold mb-2">Preview:</p>
                                                    <img src={settings.heroImage} alt="Hero Preview" className="img-fluid rounded-2" style={{ maxHeight: '200px' }} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSettings;
