import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import '../css/Hero.css';

const Hero = () => {
    const [imgError, setImgError] = useState(false);
    const [tiltStyles, setTiltStyles] = useState({
        transform: 'perspective(1000px) rotateX(0deg) rotateY(-5deg) scale(1)'
    });

    const handleMouseMove = (e) => {
        const { clientX, clientY, currentTarget } = e;
        const { left, top, width, height } = currentTarget.getBoundingClientRect();

        // Calculate rotation based on cursor position within the container
        const x = (clientX - left) / width;
        const y = (clientY - top) / height;

        const rotateX = (y - 0.5) * -20; // Max 10 degrees tilt
        const rotateY = (x - 0.5) * 20;  // Max 10 degrees tilt

        setTiltStyles({
            transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`
        });
    };

    const handleMouseLeave = () => {
        setTiltStyles({
            transform: 'perspective(1000px) rotateX(0deg) rotateY(-5deg) scale(1)'
        });
    };

    return (
        <section className="hero-section">
            <div className="hero-blob"></div>
            <div className="container py-5">
                <div className="row align-items-center flex-md-row-reverse g-5 py-5">
                    <div className="col-12 col-lg-6">
                        <div
                            className="hero-image-wrapper p-4"
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        >
                            <img
                                src={imgError ? "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=1000&auto=format&fit=crop" : "https://www.pngarts.com/files/13/Nike-Shoes-PNG-Image-Background-Transparent.png"}
                                className="d-block mx-lg-auto img-fluid hero-image"
                                alt="Sneaker Showcase"
                                style={{
                                    ...tiltStyles,
                                    filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.15))'
                                }}
                                loading="lazy"
                                onError={() => setImgError(true)}
                            />
                            <div className="hero-shadow"></div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <div className="hero-badge mb-4">
                            <span className="text-primary fw-bold">NEW ARRIVAL</span>
                            <span className="text-secondary opacity-50">|</span>
                            <span className="text-secondary fw-medium">SPRING 2026</span>
                        </div>
                        <h1 className="display-1 fw-black lh-1 mb-4 text-body-emphasis" style={{ letterSpacing: '-2px' }}>
                            STEP INTO <br />
                            <span className="text-primary">THE FUTURE.</span>
                        </h1>
                        <p className="lead text-secondary mb-5 fs-4" style={{ maxWidth: '500px' }}>The next generation of urban footwear is here. Experience gravity-defying comfort and unparalleled style.</p>
                        <div className="d-flex flex-column flex-sm-row gap-3">
                            <Link to="/shop" className="btn btn-primary btn-lg px-5 py-3 rounded-pill d-flex align-items-center justify-content-center gap-2">
                                Shop Collection <ArrowRight size={20} />
                            </Link>
                            <Link to="/about" className="btn btn-outline-secondary btn-lg px-5 py-3 rounded-pill">
                                Learn More
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
