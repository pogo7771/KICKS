import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Github, Chrome, ArrowRight, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import '../css/Login.css';

const Login = () => {
    const { login } = useStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
            <div className="login-blob" style={{ top: '-10%', left: '-10%' }}></div>
            <div className="login-blob" style={{ bottom: '-10%', right: '-10%' }}></div>

            <div className="login-card">
                <div className="login-header animate-item">
                    <h2 className="display-6 fw-bold mb-2">Welcome Back</h2>
                    <p className="text-secondary">Please enter your details to sign in</p>
                </div>

                <div className="animate-item delay-1">
                    {error && (
                        <div className="alert alert-danger d-flex align-items-center gap-2 py-2 small" role="alert">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-floating mb-3 animate-item delay-1">
                        <input
                            type="email"
                            className="form-control"
                            id="emailInput"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <label htmlFor="emailInput" className="d-flex align-items-center gap-2 text-secondary">
                            <Mail size={16} /> Email address
                        </label>
                    </div>

                    <div className="form-floating mb-4 animate-item delay-2">
                        <input
                            type="password"
                            className="form-control"
                            id="passwordInput"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <label htmlFor="passwordInput" className="d-flex align-items-center gap-2 text-secondary">
                            <Lock size={16} /> Password
                        </label>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-4 animate-item delay-3">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="rememberMe" />
                            <label className="form-check-label small text-secondary" htmlFor="rememberMe">
                                Remember me
                            </label>
                        </div>
                        <Link to="#" className="small text-primary text-decoration-none fw-medium">
                            Forgot password?
                        </Link>
                    </div>

                    <div className="animate-item delay-4 mb-4">
                        <button
                            type="submit"
                            className="btn btn-primary w-100 py-3 rounded-pill d-flex align-items-center justify-content-center gap-2"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <div className="spinner-border spinner-border-sm" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    Signing In...
                                </>
                            ) : (
                                <>
                                    Sign In <LogIn size={20} />
                                </>
                            )}
                        </button>
                    </div>

                    <div className="divider animate-item delay-5">or continue with</div>

                    <div className="row g-3 animate-item delay-5">
                        <div className="col-6">
                            <button type="button" className="social-login-btn">
                                <Chrome size={20} className="text-danger" /> Google
                            </button>
                        </div>
                        <div className="col-6">
                            <button type="button" className="social-login-btn">
                                <Github size={20} /> GitHub
                            </button>
                        </div>
                    </div>
                </form>

                <div className="text-center mt-5 animate-item delay-5">
                    <p className="text-secondary mb-0">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary fw-bold text-decoration-none">
                            Create account
                        </Link>
                    </p>
                </div>
            </div>

        </div>
    );
};

export default Login;
