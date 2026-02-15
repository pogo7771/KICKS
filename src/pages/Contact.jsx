import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import '../css/Contact.css';

const Contact = () => {
    const { showNotification } = useNotification();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        showNotification('Message sent successfully! We will get back to you soon.', 'success');
        setFormData({ name: '', email: '', message: '' });
        setIsLoading(false);
    };
    return (
        <div className="container py-5 contact-page">
            <h1 className="text-center display-4 fw-bold mb-5">Get in Touch</h1>

            <div className="row g-5">
                <div className="col-md-6">
                    <h3 className="mb-4">Send us a message</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Name</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Your Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Message</label>
                            <textarea
                                className="form-control"
                                rows="5"
                                placeholder="How can we help?"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                required
                                disabled={isLoading}
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="btn btn-dark w-100 py-3 rounded-3 d-flex align-items-center justify-content-center gap-2"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <div className="spinner-border spinner-border-sm" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    Sending...
                                </>
                            ) : (
                                <>
                                    Send Message <Send size={18} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="col-md-6">
                    <div className="bg-light p-4 rounded h-100">
                        <h3 className="mb-4">Contact Information</h3>

                        <div className="d-flex align-items-center mb-4">
                            <div className="bg-white p-3 rounded-circle shadow-sm me-3">
                                <Mail size={24} className="text-primary" />
                            </div>
                            <div>
                                <h6 className="mb-0 fw-bold">Email Us</h6>
                                <p className="mb-0 text-secondary">support@kickstore.com</p>
                            </div>
                        </div>

                        <div className="d-flex align-items-center mb-4">
                            <div className="bg-white p-3 rounded-circle shadow-sm me-3">
                                <Phone size={24} className="text-primary" />
                            </div>
                            <div>
                                <h6 className="mb-0 fw-bold">Call Us</h6>
                                <p className="mb-0 text-secondary">+91 98765 43210</p>
                            </div>
                        </div>

                        <div className="d-flex align-items-center">
                            <div className="bg-white p-3 rounded-circle shadow-sm me-3">
                                <MapPin size={24} className="text-primary" />
                            </div>
                            <div>
                                <h6 className="mb-0 fw-bold">Visit Us</h6>
                                <p className="mb-0 text-secondary">
                                    123 Fashion Street,<br />
                                    Mumbai, Maharashtra 400001
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
