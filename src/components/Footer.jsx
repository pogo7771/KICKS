import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Send, ArrowUpRight } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import '../css/Footer.css';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { showNotification } = useNotification();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        showNotification('Thank you for subscribing! Check your email for the 15% discount code.', 'success');
        setEmail('');
        setIsLoading(false);
    };
    return (
        <footer className="footer-main pt-5 mt-5">
            <div className="footer-glow"></div>
            <div className="container py-5">
                <div className="row g-5">
                    <div className="col-lg-4">
                        <Link to="/" className="text-white text-decoration-none fw-black fs-2 mb-3 d-block tracking-tighter">
                            KICKS<span className="text-primary">.</span>
                        </Link>
                        <p className="text-secondary mb-4" style={{ maxWidth: '300px' }}>
                            Elevating the street-wear experience since 2026. Premium sneakers for the next generation.
                        </p>
                        <div className="d-flex gap-3">
                            <a href="#" className="social-circle" aria-label="Facebook"><Facebook size={18} /></a>
                            <a href="#" className="social-circle" aria-label="Twitter"><Twitter size={18} /></a>
                            <a href="#" className="social-circle" aria-label="Instagram"><Instagram size={18} /></a>
                        </div>
                    </div>

                    <div className="col-6 col-md-3 col-lg-2">
                        <h6 className="text-white fw-bold mb-4">CATEGORIES</h6>
                        <div className="d-flex flex-column">
                            <Link to="/shop" className="nav-link">New Arrivals</Link>
                            <Link to="/men" className="nav-link">Men's Collection</Link>
                            <Link to="/women" className="nav-link">Women's Collection</Link>
                            <Link to="/sale" className="nav-link">Sale Items</Link>
                        </div>
                    </div>

                    <div className="col-6 col-md-3 col-lg-2">
                        <h6 className="text-white fw-bold mb-4">COMPANY</h6>
                        <div className="d-flex flex-column">
                            <Link to="/about" className="nav-link">About Us</Link>
                            <Link to="/contact" className="nav-link">Contact</Link>
                            <Link to="/privacy" className="nav-link">Privacy</Link>
                            <Link to="/terms" className="nav-link">Terms</Link>
                        </div>
                    </div>

                    <div className="col-lg-4 col-md-6">
                        <h6 className="text-white fw-bold mb-4">NEWSLETTER</h6>
                        <p className="text-secondary smaller mb-4">Get early access to limited edition drops and 15% off your first order.</p>
                        <form className="position-relative" onSubmit={handleSubmit}>
                            <input
                                type="email"
                                className="form-control newsletter-input"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                className="btn btn-primary position-absolute end-0 top-0 h-100 rounded-start-0 px-4"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="spinner-border spinner-border-sm" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                ) : (
                                    <Send size={18} />
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="footer-bottom d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                    <p className="text-secondary smaller mb-0">
                        &copy; {new Date().getFullYear()} KICKS STORE IND. ALL RIGHTS RESERVED.
                    </p>
                    <div className="d-flex gap-4">
                        <Link to="/admin" target="_blank" rel="noopener noreferrer" className="text-secondary smaller text-decoration-none hover-white d-flex align-items-center gap-1">
                            Staff Portal <ArrowUpRight size={14} />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
