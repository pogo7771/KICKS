import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Github, Chrome, AlertCircle, ShoppingBag, Eye, EyeOff } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import '../css/Login.css';

const Login = () => {
    const { login } = useStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const result = await login(email, password);

        setIsLoading(false);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.message || 'Login failed');
        }
    };

    return (
        <div className="login-page">
            <div className="login-form-wrapper">
                {/* Left Side - Visual */}
                <div className="login-visual">
                    <h1>Simplify <br />management With <br />Our dashboard.</h1>
                    <p>Simplify your e-commerce management with our user-friendly admin dashboard.</p>
                    <div className="visual-illustration"></div>
                </div>

                {/* Right Side - Form */}
                <div className="login-card">
                    <div className="login-header">
                        <div className="brand-logo">
                            <div className="brand-icon">
                                <ShoppingBag size={20} />
                            </div>
                            <span>KICKS.</span>
                        </div>
                        <h2>Welcome Back</h2>
                        <p>Please login to your account</p>
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
                                    type={showPassword ? "text" : "password"}
                                    className="custom-input"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="form-extras">
                            <Link to="#" className="forgot-password">
                                Forgot Password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            className="login-btn"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing In...' : 'Login'}
                        </button>

                        <div className="divider">
                            <span>Or Login With</span>
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
                        Don't have an account?
                        <Link to="/register">
                            SignUp
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
