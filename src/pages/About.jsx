import React from 'react';
import { Target, Users, Award, ShieldCheck } from 'lucide-react';
import '../css/About.css';

const About = () => {
    return (
        <div className="about-page">
            {/* Mission Hero */}
            <div className="mission-hero-section text-white py-5 mb-5">
                <div className="container py-5 text-center">
                    <span className="badge-premium bg-white text-dark mb-4 d-inline-block">OUR STORY</span>
                    <h1 className="display-1 fw-black mb-4 letter-spacing-1">WE ARE KICKS<span className="text-accent">.</span></h1>
                    <p className="lead opacity-75 mx-auto fs-4" style={{ maxWidth: '750px' }}>
                        Founded on the streets, fueled by culture. We are more than a sneakers store — we are the heartbeat of modern footwear.
                    </p>
                </div>
            </div>

            <div className="container py-5">
                <div className="row align-items-center g-5 mb-5">
                    <div className="col-lg-6 reveal">
                        <h2 className="display-5 fw-black mb-4">Redefining Urban Footwear</h2>
                        <p className="text-secondary mb-4 fs-5">
                            Founded in 2026, KICKS started with a simple mission: to bridge the gap between high-end fashion and everyday comfort. We believe that what you wear on your feet shapes your journey.
                        </p>
                        <div className="row g-4 mt-2">
                            <div className="col-6">
                                <div className="d-flex align-items-center gap-2">
                                    <div className="p-2 bg-light rounded-3"><Target size={20} className="text-primary" /></div>
                                    <span className="fw-bold smaller">Purpose Driven</span>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="d-flex align-items-center gap-2">
                                    <div className="p-2 bg-light rounded-3"><Users size={20} className="text-primary" /></div>
                                    <span className="fw-bold smaller">Community First</span>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="d-flex align-items-center gap-2">
                                    <div className="p-2 bg-light rounded-3"><Award size={20} className="text-primary" /></div>
                                    <span className="fw-bold smaller">Premium Quality</span>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="d-flex align-items-center gap-2">
                                    <div className="p-2 bg-light rounded-3"><ShieldCheck size={20} className="text-primary" /></div>
                                    <span className="fw-bold smaller">Verified Goods</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6 reveal">
                        <div className="position-relative">
                            <img
                                src="https://images.unsplash.com/photo-1556906781-9a412961d28c?q=80&w=1000&auto=format&fit=crop"
                                alt="Our Store"
                                className="img-fluid rounded-5 shadow-premium about-image"
                            />
                            <div className="position-absolute bottom-0 start-0 m-4 p-4 glass-panel text-dark" style={{ maxWidth: '250px' }}>
                                <div className="fw-black h4 mb-0">2026</div>
                                <div className="smaller fw-bold opacity-75">ESTABLISHED IN THE HEART OF THE METROPOLIS</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row g-4 text-center mt-5">
                    <div className="col-12 mb-4">
                        <h3 className="display-6 fw-black">THE KICKS PROMISE</h3>
                    </div>
                    <div className="col-md-4 reveal">
                        <div className="promise-card p-5 rounded-5 h-100">
                            <div className="promise-icon-wrapper text-primary">
                                <Award size={32} />
                            </div>
                            <h3 className="h4 fw-black mb-3 text-dark">EXPERT CURATION</h3>
                            <p className="text-secondary smaller mb-0">Only the rarest and most exclusive drops make it to our collection through rigorous trend analysis.</p>
                        </div>
                    </div>
                    <div className="col-md-4 reveal">
                        <div className="promise-card p-5 rounded-5 h-100">
                            <div className="promise-icon-wrapper text-primary">
                                <ShieldCheck size={32} />
                            </div>
                            <h3 className="h4 fw-black mb-3 text-dark">VERIFIED PURE</h3>
                            <p className="text-secondary smaller mb-0">Our 24-point check ensures your sneakers are 100% authentic, every single time.</p>
                        </div>
                    </div>
                    <div className="col-md-4 reveal">
                        <div className="promise-card p-5 rounded-5 h-100">
                            <div className="promise-icon-wrapper text-primary">
                                <Users size={32} />
                            </div>
                            <h3 className="h4 fw-black mb-3 text-dark">GLOBAL ACCESS</h3>
                            <p className="text-secondary smaller mb-0">Join our inner circle for priority access to worldwide restocks and secret drops.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
