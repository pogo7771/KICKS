import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Github, Chrome, AlertCircle, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import '../css/Login.css';

const Register = () => {
    const { register } = useStore();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        const result = await register(name, email, password);

        setIsLoading(false);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.message || 'Registration failed');
        }
    };

    return (
        <div className="login-page">
            <div className="login-form-wrapper">
                {/* Left Side - Visual */}
                <div className="login-visual" style={{ background: 'linear-gradient(135deg, #FF6B6B 0%, #EE5253 100%)' }}>
                    <h1>Join The <br />KICKS Community.<br />Today.</h1>
                    <p>Create an account to unlock exclusive drops, track orders, and experience the future of sneaker shopping.</p>
                    <div className="visual-illustration"></div>
                </div>

                {/* Right Side - Form */}
                <div className="login-card">
                    <div className="login-header">
                        <div className="brand-logo">
                            <div className="brand-icon" style={{ background: '#FF6B6B' }}>
                                <ShoppingBag size={20} />
                            </div>
                            <span>KICKS.</span>
                        </div>
                        <h2>Create Account</h2>
                        <p>Please enter your details to sign up</p>
                    </div>

                    {error && (
                        <div className="alert alert-danger d-flex align-items-center gap-2 py-2 mb-4 rounded-3 small fw-bold" role="alert">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                type="text"
                                className="custom-input"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <input
                                type="email"
                                className="custom-input"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <div className="password-input-wrapper">
                                <input
                                    type="password"
                                    className="custom-input"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="password-input-wrapper">
                                <input
                                    type="password"
                                    className="custom-input"
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="login-btn"
                            disabled={isLoading}
                            style={{ background: '#FF6B6B', boxShadow: '0 4px 6px -1px rgba(255, 107, 107, 0.2)' }}
                        >
                            {isLoading ? 'Creating Account...' : 'Sign Up'}
                        </button>

                        <div className="divider">
                            <span>Or Sign Up With</span>
                        </div>

                        <div className="social-login">
                            <button type="button" className="social-btn">
                                <Chrome size={20} className="text-danger" /> Google
                            </button>
                            <button type="button" className="social-btn">
                                <Github size={20} /> Facebook
                            </button>
                        </div>
                    </form>

                    <div className="signup-link">
                        Already have an account?
                        <Link to="/login" style={{ color: '#FF6B6B' }}>
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
