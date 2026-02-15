import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ShoppingBag, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import '../../css/admin/AdminLogin.css';

const AdminLogin = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [show2FA, setShow2FA] = useState(false);
    const [view, setView] = useState('login'); // 'login', 'forgot', 'reset'
    const [resetEmail, setResetEmail] = useState('');
    const [resetToken, setResetToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const { isAdmin, login, verify2FA, resetAdminPasswordRequest, resetAdminPassword } = useStore();
    const navigate = useNavigate();

    if (isAdmin) return <Navigate to="/admin/dashboard" replace />;

    const handleChange = (e) => {
        setCredentials(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        const result = await login(credentials.email, credentials.password, true);
        setIsLoading(false);

        if (result.requires2FA) {
            setShow2FA(true);
            setTempId(result.tempId);
        } else if (result.success) {
            navigate('/admin/dashboard');
        } else {
            setError(result.message || 'Invalid credentials');
        }
    };

    const handleVerify2FA = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        const result = await verify2FA(tempId, verificationCode);
        setIsLoading(false);

        if (result.success) {
            navigate('/admin/dashboard');
        } else {
            setError(result.message || 'Invalid 2FA code');
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccessMessage('');

        const result = await resetAdminPasswordRequest(resetEmail);
        setIsLoading(false);

        if (result.success) {
            setSuccessMessage(result.message);
            // In a real app, the user would click a link in email.
            // Here we simulate it by setting the token and moving to reset view for demonstration
            if (result.devToken) {
                console.log("DEV ONLY: Auto-switching to reset view with token:", result.devToken);
                setResetToken(result.devToken);
                setTimeout(() => {
                    setView('reset');
                    setSuccessMessage('');
                }, 2000);
            }
        } else {
            setError(result.message || 'Failed to request password reset');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const result = await resetAdminPassword(resetToken, newPassword);
        setIsLoading(false);

        if (result.success) {
            setSuccessMessage('Password reset successfully. Please login.');
            setTimeout(() => {
                setView('login');
                setSuccessMessage('');
                setReseToken('');
                setNewPassword('');
            }, 2000);
        } else {
            setError(result.message || 'Failed to reset password');
        }
    };

    return (
        <div className="admin-login-wrapper">
            <div className="bg-blur-circle circle-1"></div>
            <div className="bg-blur-circle circle-2"></div>

            <div className="admin-login-card animate-slide-up">
                <div className="login-header text-center mb-4">
                    <div className="logo-box mb-3 mx-auto">
                        <ShoppingBag size={32} className="text-white" />
                    </div>
                    <h2 className="fw-black text-dark mb-1">Admin Central</h2>
                    <p className="text-secondary small">Authorized Personnel Only</p>
                </div>

                <form onSubmit={
                    view === 'forgot' ? handleForgotPassword :
                        view === 'reset' ? handleResetPassword :
                            show2FA ? handleVerify2FA : handleSubmit
                }>
                    {error && (
                        <div className="alert alert-danger py-2 px-3 small border-0 rounded-3 mb-3 d-flex align-items-center gap-2">
                            <ShieldCheck size={16} /> {error}
                        </div>
                    )}

                    {successMessage && (
                        <div className="alert alert-success py-2 px-3 small border-0 rounded-3 mb-3 d-flex align-items-center gap-2">
                            <ShieldCheck size={16} /> {successMessage}
                        </div>
                    )}

                    {view === 'login' && !show2FA && (
                        <>
                            <div className="mb-3">
                                <label className="form-label smaller fw-bold uppercase letter-spacing-1 text-secondary">Email Address</label>
                                <div className="input-group-premium">
                                    <Mail size={18} className="icon" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={credentials.email}
                                        onChange={handleChange}
                                        placeholder="admin@store.com"
                                        className="form-control"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-2">
                                <label className="form-label smaller fw-bold uppercase letter-spacing-1 text-secondary">Secures Key</label>
                                <div className="input-group-premium">
                                    <Lock size={18} className="icon" />
                                    <input
                                        type="password"
                                        name="password"
                                        value={credentials.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="form-control"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="d-flex justify-content-end mb-4">
                                <button type="button" className="btn btn-link p-0 text-secondary smaller text-decoration-none" onClick={() => setView('forgot')}>
                                    Forgot Password?
                                </button>
                            </div>
                        </>
                    )}

                    {view === 'forgot' && (
                        <div className="mb-4 animate-fade-in">
                            <p className="text-center text-secondary smaller mb-4">Enter your email address and we'll send you a link to reset your password.</p>
                            <div className="mb-3">
                                <label className="form-label smaller fw-bold uppercase letter-spacing-1 text-secondary">Email Address</label>
                                <div className="input-group-premium">
                                    <Mail size={18} className="icon" />
                                    <input
                                        type="email"
                                        value={resetEmail}
                                        onChange={(e) => setResetEmail(e.target.value)}
                                        placeholder="admin@store.com"
                                        className="form-control"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {view === 'reset' && (
                        <div className="mb-4 animate-fade-in">
                            <p className="text-center text-secondary smaller mb-4">Create a new strong password for your account.</p>
                            <label className="form-label smaller fw-bold uppercase letter-spacing-1 text-secondary">New Password</label>
                            <div className="input-group-premium">
                                <Lock size={18} className="icon" />
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="New secure password"
                                    className="form-control"
                                    required
                                    minLength={8}
                                />
                            </div>
                        </div>
                    )}

                    {show2FA && (
                        <div className="mb-4 text-center animate-fade-in">
                            <label className="form-label smaller fw-bold uppercase letter-spacing-1 text-secondary d-block mb-3">Verification Code</label>
                            <input
                                type="text"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="000000"
                                className="form-control form-control-lg text-center fw-black letter-spacing-1 py-3 rounded-4 border-2"
                                style={{ fontSize: '1.5rem' }}
                                required
                            />
                            <p className="smaller text-secondary mt-3">Enter the 6-digit code from your app</p>
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary w-100 py-3 rounded-pill fw-black d-flex align-items-center justify-content-center gap-2 shadow-lg" disabled={isLoading}>
                        {isLoading ? (
                            <span className="spinner-border spinner-border-sm"></span>
                        ) : (
                            <>
                                {view === 'forgot' ? 'Send Reset Link' :
                                    view === 'reset' ? 'Reset Password' :
                                        show2FA ? 'Confirm Identity' : 'Enter Dashboard'}
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>

                    {(show2FA || view !== 'login') && (
                        <button type="button" className="btn btn-link w-100 text-secondary smaller mt-3 fw-bold text-decoration-none"
                            onClick={() => {
                                setShow2FA(false);
                                setView('login');
                                setError('');
                                setSuccessMessage('');
                            }}>
                            Cancel and return to login
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
