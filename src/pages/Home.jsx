import React from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { ArrowRight, Truck, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import BrandMarquee from '../components/BrandMarquee';
import CategoryShowcase from '../components/CategoryShowcase';
import { useStore } from '../context/StoreContext';

const Home = () => {
    const { products, formatPrice } = useStore();

    // Categorized products using the context data
    const runningShoes = (products || []).filter(s => s.category === 'Running').slice(0, 4);
    const lifestyleShoes = (products || []).filter(s => s.category === 'Lifestyle' || s.category === 'Casual').slice(0, 4);
    const classicShoes = (products || []).filter(s => s.category === 'Classic').slice(0, 4);

    return (
        <div className="home-page">
            <Hero />

            <section className="features-section py-5 bg-light reveal">
                <div className="container">
                    <div className="row g-4 text-center">
                        <div className="col-md-4">
                            <div className="p-4 rounded-4 bg-white shadow-sm h-100">
                                <div className="feature-icon mb-3 text-primary">
                                    <Truck size={40} />
                                </div>
                                <h3 className="h5 fw-bold">Free Shipping</h3>
                                <p className="text-secondary mb-0">On all orders over {formatPrice(999)}. Fast delivery across India.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="p-4 rounded-4 bg-white shadow-sm h-100">
                                <div className="feature-icon mb-3 text-primary">
                                    <ShieldCheck size={40} />
                                </div>
                                <h3 className="h5 fw-bold">Secure Payment</h3>
                                <p className="text-secondary mb-0">100% secure payment processing with top-tier encryption.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="p-4 rounded-4 bg-white shadow-sm h-100">
                                <div className="feature-icon mb-3 text-primary">
                                    <Zap size={40} />
                                </div>
                                <h3 className="h5 fw-bold">Instant Support</h3>
                                <p className="text-secondary mb-0">24/7 dedicated support team ready to help you anytime.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <BrandMarquee />

            <CategoryShowcase className="reveal" />

            {/* Running Collection */}
            <section className="featured-products py-5 reveal">
                <div className="container py-4">
                    <div className="d-flex justify-content-between align-items-end mb-4">
                        <div>
                            <span className="text-primary fw-bold text-uppercase small tracking-wider">Performance</span>
                            <h2 className="display-5 fw-bold mt-1">Running Essentials</h2>
                        </div>
                        <Link to="/shop" className="btn btn-link text-decoration-none fw-bold d-flex align-items-center gap-2">
                            View All <ArrowRight size={20} />
                        </Link>
                    </div>
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                        {runningShoes.map(shoe => (
                            <div className="col" key={shoe.id || shoe._id}>
                                <ProductCard product={shoe} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Lifestyle Collection */}
            <section className="featured-products py-5 bg-light bg-opacity-50 reveal">
                <div className="container py-4">
                    <div className="d-flex justify-content-between align-items-end mb-4">
                        <div>
                            <span className="text-primary fw-bold text-uppercase small tracking-wider">Style</span>
                            <h2 className="display-5 fw-bold mt-1">Lifestyle & Casual</h2>
                        </div>
                        <Link to="/shop" className="btn btn-link text-decoration-none fw-bold d-flex align-items-center gap-2">
                            View All <ArrowRight size={20} />
                        </Link>
                    </div>
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                        {lifestyleShoes.map(shoe => (
                            <div className="col" key={shoe.id || shoe._id}>
                                <ProductCard product={shoe} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Classic Collection */}
            <section className="featured-products py-5 reveal">
                <div className="container py-4">
                    <div className="d-flex justify-content-between align-items-end mb-4">
                        <div>
                            <span className="text-primary fw-bold text-uppercase small tracking-wider">Heritage</span>
                            <h2 className="display-5 fw-bold mt-1">Classic Collection</h2>
                        </div>
                        <Link to="/shop" className="btn btn-link text-decoration-none fw-bold d-flex align-items-center gap-2">
                            View All <ArrowRight size={20} />
                        </Link>
                    </div>
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                        {classicShoes.map(shoe => (
                            <div className="col" key={shoe.id || shoe._id}>
                                <ProductCard product={shoe} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="cta-section py-5 mb-5 reveal">
                <div className="container">
                    <div className="bg-dark text-white rounded-5 p-5 position-relative overflow-hidden shadow-lg">
                        <div className="row align-items-center position-relative z-1">
                            <div className="col-lg-7">
                                <h2 className="display-4 fw-bold mb-3">Join The Squad. <br /> Get 20% Off.</h2>
                                <p className="lead mb-4 opacity-75">Subscribe to our newsletter and be the first to know about new drops and exclusive offers.</p>
                                <div className="d-flex gap-2 w-100" style={{ maxWidth: '500px' }}>
                                    <input type="email" className="form-control form-control-lg bg-white bg-opacity-10 border-white border-opacity-25 text-white flex-grow-1" placeholder="your@email.com" />
                                    <button className="btn btn-primary btn-lg px-4 fw-bold flex-shrink-0">Subscribe</button>
                                </div>
                            </div>
                        </div>
                        {/* Decorative background circle */}
                        <div className="position-absolute end-0 top-0 translate-middle-y translate-middle-x opacity-10 bg-primary rounded-circle" style={{ width: '600px', height: '600px', marginRight: '-300px', marginTop: '0' }}></div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
