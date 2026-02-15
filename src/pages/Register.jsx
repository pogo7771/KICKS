import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, Github, Chrome, ArrowRight, AlertCircle } from 'lucide-react';
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
            <div className="login-blob" style={{ top: '-10%', left: '-10%' }}></div>
            <div className="login-blob" style={{ bottom: '-10%', right: '-10%' }}></div>

            <div className="login-card">
                <div className="login-header animate-item">
                    <h2 className="display-6 fw-bold mb-2">Create Account</h2>
                    <p className="text-secondary">Join the KICKS community today</p>
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
                            type="text"
                            className="form-control"
                            id="nameInput"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <label htmlFor="nameInput" className="d-flex align-items-center gap-2 text-secondary">
                            <User size={16} /> Full Name
                        </label>
                    </div>

                    <div className="form-floating mb-3 animate-item delay-2">
                        <input
                            type="email"
                            className="form-control"
                            id="registerEmailInput"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <label htmlFor="registerEmailInput" className="d-flex align-items-center gap-2 text-secondary">
                            <Mail size={16} /> Email address
                        </label>
                    </div>

                    <div className="form-floating mb-3 animate-item delay-3">
                        <input
                            type="password"
                            className="form-control"
                            id="registerPasswordInput"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <label htmlFor="registerPasswordInput" className="d-flex align-items-center gap-2 text-secondary">
                            <Lock size={16} /> Password
                        </label>
                    </div>

                    <div className="form-floating mb-4 animate-item delay-4">
                        <input
                            type="password"
                            className="form-control"
                            id="confirmPasswordInput"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <label htmlFor="confirmPasswordInput" className="d-flex align-items-center gap-2 text-secondary">
                            <Lock size={16} /> Confirm Password
                        </label>
                    </div>

                    <div className="animate-item delay-5 mb-4">
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
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    Sign Up <UserPlus size={20} />
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
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary fw-bold text-decoration-none">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>

        </div>
    );
};

export default Register;
