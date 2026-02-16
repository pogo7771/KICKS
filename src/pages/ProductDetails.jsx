import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Star, Heart, CreditCard, Truck, RefreshCcw, Shield, CheckCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useNotification } from '../context/NotificationContext';
import ProductCard from '../components/ProductCard';
import ProductReviews from '../components/ProductReviews';
import '../css/ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const { products: shoes, formatPrice, loading } = useStore();
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { showNotification } = useNotification();

    const product = shoes.find((shoe) => String(shoe.id) === id || String(shoe._id) === id);

    const [selectedSize, setSelectedSize] = useState(null);
    const [activeTab, setActiveTab] = useState('description');
    const [imgError, setImgError] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [mainImage, setMainImage] = useState(null);

    const placeholderImg = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop";

    if (loading) {
        return (
            <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!product) return (
        <div className="container py-5 text-center">
            <h3>Product not found</h3>
            <p className="text-secondary">The product you are looking for does not exist or has been removed.</p>
            <Link to="/shop" className="btn btn-primary mt-3">Back to Shop</Link>
        </div>
    );

    const relatedProducts = shoes.filter(shoe => shoe.category === product.category && (String(shoe.id) !== id && String(shoe._id) !== id)).slice(0, 4);
    const isFav = isInWishlist(product.id || product._id);

    const images = [
        product.images?.primary,
        product.images?.secondary,
        "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop"
    ].filter(Boolean);

    const handleAddToCart = () => {
        if (!selectedSize) {
            showNotification('Please select a size first', 'error');
            return;
        }
        if (product.stock === 0) {
            showNotification('This item is out of stock', 'error');
            return;
        }
        setIsAdding(true);
        setTimeout(() => {
            addToCart(product, selectedSize);
            showNotification(`Added ${product.name} to your bag!`, 'success');
            setIsAdding(false);
        }, 800);
    };

    const navigate = useNavigate();

    const handleBuyNow = () => {
        if (!selectedSize) {
            showNotification('Please select a size first', 'error');
            return;
        }
        if (product.stock === 0) {
            showNotification('This item is out of stock', 'error');
            return;
        }

        addToCart(product, selectedSize);
        navigate('/checkout');
    };

    return (
        <div className="container py-5 product-details-page">
            <Link to="/shop" className="text-decoration-none text-secondary d-flex align-items-center gap-2 mb-4 smaller fw-bold">
                <ArrowLeft size={16} /> BACK TO COLLECTION
            </Link>

            <div className="row g-5 mb-5">
                <div className="col-lg-7">
                    <div className="row g-3">
                        <div className="col-2 d-none d-md-flex flex-column gap-3">
                            {images.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    className={`thumbnail-pill ${(mainImage || product.images?.primary) === img ? 'active' : ''}`}
                                    onClick={() => setMainImage(img)}
                                    alt=""
                                />
                            ))}
                        </div>
                        <div className="col-12 col-md-10">
                            <div className="bg-light rounded-4 overflow-hidden product-zoom-container">
                                <img
                                    src={imgError ? placeholderImg : (mainImage || product.images?.primary)}
                                    alt={product.name}
                                    className="w-100 h-100 object-fit-cover product-main-image"
                                    onError={() => setImgError(true)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-5">
                    <div className="ps-lg-4">
                        <div className="d-flex align-items-center gap-2 mb-2">
                            <span className="badge-premium bg-primary text-white">AUTHENTIC</span>
                            <span className="text-secondary smaller fw-bold">{product.brand || 'KICKS ORIGINAL'}</span>
                        </div>

                        <h1 className="display-4 fw-black mb-2">{product.name}</h1>

                        <div className="d-flex align-items-center gap-3 mb-4">
                            <h2 className="fw-black text-primary mb-0">{formatPrice(product.price)}</h2>
                            <div className="d-flex align-items-center gap-1 bg-warning bg-opacity-10 px-2 py-1 rounded">
                                <Star size={16} className="text-warning fill-warning" />
                                <span className="fw-bold fs-6">{product.rating ? product.rating.toFixed(1) : 'New'}</span>
                                <span className="text-secondary smaller">({product.numReviews || 0} reviews)</span>
                            </div>
                        </div>

                        <p className="text-secondary mb-4 pb-4 border-bottom">
                            {product.description || "The next evolution of performance footwear. Engineered with breathable mesh and responsive cushioning for ultimate lockdown."}
                        </p>

                        <div className="mb-4">
                            <div className="d-flex justify-content-between mb-3">
                                <label className="fw-black smaller">SELECT SIZE (UK)</label>
                                <Link to="/size-guide" className="text-primary smaller fw-bold text-decoration-none">Size Guide</Link>
                            </div>
                            <div className="d-flex flex-wrap gap-2">
                                {[7, 8, 9, 10, 11, 12].map(size => (
                                    <div
                                        key={size}
                                        className={`size-pill ${selectedSize === size ? 'active' : ''}`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="d-flex flex-column gap-3 mb-5">
                            <div className="d-flex gap-3">
                                <button
                                    onClick={handleAddToCart}
                                    className="btn btn-primary btn-lg flex-grow-1 py-3 d-flex align-items-center justify-content-center gap-2"
                                    disabled={isAdding || product.stock === 0}
                                >
                                    {isAdding ? <div className="spinner-border spinner-border-sm" /> : <><ShoppingBag size={20} /> ADD TO BAG</>}
                                </button>
                                <button
                                    className={`btn btn-lg px-4 ${isFav ? 'btn-danger text-white' : 'btn-outline-dark'}`}
                                    onClick={() => toggleWishlist(product)}
                                >
                                    <Heart size={20} fill={isFav ? "white" : "none"} />
                                </button>
                            </div>
                            <button
                                className="btn btn-dark btn-lg py-3 fw-bold buy-now-btn"
                                onClick={handleBuyNow}
                                disabled={product.stock === 0}
                            >
                                BUY IT NOW
                            </button>
                        </div>

                        <div className="row g-3">
                            <div className="col-4">
                                <div className="trust-card">
                                    <Truck size={20} className="text-primary mb-2" />
                                    <span className="smaller fw-bold">FREE<br />SHIPPING</span>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="trust-card">
                                    <RefreshCcw size={20} className="text-primary mb-2" />
                                    <span className="smaller fw-bold">30 DAYS<br />RETURNS</span>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="trust-card">
                                    <CheckCircle size={20} className="text-primary mb-2" />
                                    <span className="smaller fw-bold">SECURE<br />CHECKOUT</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mb-5">
                <div className="col-12">
                    <ul className="nav nav-tabs-premium mb-4">
                        <li className="nav-item">
                            <button className={`nav-link ${activeTab === 'description' ? 'active' : ''}`} onClick={() => setActiveTab('description')}>DESCRIPTION</button>
                        </li>
                        <li className="nav-item">
                            <button className={`nav-link ${activeTab === 'details' ? 'active' : ''}`} onClick={() => setActiveTab('details')}>TECH SPECS</button>
                        </li>
                        <li className="nav-item">
                            <button className={`nav-link ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>REVIEWS ({product.numReviews || 0})</button>
                        </li>
                    </ul>

                    <div className="py-4">
                        {activeTab === 'description' && (
                            <div className="row">
                                <div className="col-md-8">
                                    <h4 className="fw-black mb-3">REDEFINING COMFORT</h4>
                                    <p className="text-secondary">Designed for the modern athlete, this model features our latest energy-return technology. The lightweight upper provides a supportive fit that feels secure through every move. Whether you're hitting the gym or the streets, this is your ultimate companion.</p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'details' && (
                            <div className="row g-4">
                                <div className="col-md-4">
                                    <div className="p-3 bg-light rounded-3">
                                        <span className="smaller text-secondary d-block">MATERIAL</span>
                                        <span className="fw-bold">Breathable Knit Mesh</span>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="p-3 bg-light rounded-3">
                                        <span className="smaller text-secondary d-block">WEIGHT</span>
                                        <span className="fw-bold">295 Grams</span>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="p-3 bg-light rounded-3">
                                        <span className="smaller text-secondary d-block">CUSHIONING</span>
                                        <span className="fw-bold">React+ Midsole</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <ProductReviews product={product} />
                        )}
                    </div>
                </div>
            </div>

            {relatedProducts.length > 0 && (
                <div className="mt-5 pt-5 border-top">
                    <h3 className="fw-black mb-4">COMPLETE YOUR STYLE</h3>
                    <div className="row row-cols-2 row-cols-md-4 g-4">
                        {relatedProducts.map(shoe => (
                            <div className="col" key={shoe.id || shoe._id}>
                                <ProductCard product={shoe} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetails;
