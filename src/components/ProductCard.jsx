import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Heart, Eye, Star } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useNotification } from '../context/NotificationContext';
import '../css/ProductCard.css';

const ProductCard = ({ product }) => {
    const { formatPrice } = useStore();
    const [imgError, setImgError] = useState(false);
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { showNotification } = useNotification();

    const isFav = isInWishlist(product.id || product._id);

    // Reliable fallback image
    const placeholderImg = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop";

    const handleQuickAdd = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (product.stock === 0) {
            showNotification('This item is out of stock', 'error');
            return;
        }

        addToCart(product, 9); // Default size 9
        showNotification(`Added ${product.name} to your bag!`, 'success');
    };

    return (
        <div
            className="card h-100 border-0 shadow-sm product-card"
        >

            {/* Image Container */}
            <div className="position-relative overflow-hidden product-image-container rounded-4 mb-3">
                <Link to={`/product/${product.id || product._id}`} className="d-block w-100 h-100 text-decoration-none">
                    <img
                        src={imgError ? placeholderImg : product?.images?.primary}
                        alt={product.name}
                        className="card-img-top product-image primary"
                        onError={(e) => {
                            e.target.onerror = null;
                            if (!imgError) setImgError(true);
                        }}
                    />
                    <img
                        src={imgError ? placeholderImg : (product?.images?.secondary || product?.images?.primary)}
                        alt={product.name}
                        className="card-img-top product-image secondary"
                        onError={(e) => {
                            e.target.onerror = null;
                            if (!imgError) setImgError(true);
                        }}
                    />
                </Link>

                <button
                    className={`btn rounded-circle position-absolute top-0 end-0 m-2 shadow-sm favorite-btn ${isFav ? 'active' : ''}`}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(product);
                        showNotification(
                            isFav ? `Removed from wishlist` : `Added to wishlist`,
                            isFav ? 'info' : 'success'
                        );
                    }}
                >
                    <Heart size={16} fill={isFav ? "currentColor" : "none"} />
                </button>

                <div className="product-badges position-absolute top-0 start-0 m-2 d-flex flex-column gap-1">
                    {product.isNew && <span className="badge-premium bg-primary text-white">New</span>}
                    {(product.stock > 0 && product.stock <= 5) ? (
                        <span className="badge-premium bg-warning text-dark">Limited Stock</span>
                    ) : product.stock === 0 && (
                        <span className="badge-premium bg-danger text-white">Sold Out</span>
                    )}
                </div>
            </div>

            {/* Card Body */}
            <div className="card-body p-0 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="text-secondary smaller fw-medium">{product.brand || 'Kicks Original'}</span>
                    <div className="rating-pill">
                        <Star size={12} fill="currentColor" />
                        <span>{(product.rating || 4.5).toFixed(1)}</span>
                    </div>
                </div>

                <h6 className="product-title mb-2">
                    <Link to={`/product/${product.id || product._id}`} className="text-decoration-none text-dark">
                        {product.name}
                    </Link>
                </h6>

                <div className="d-flex justify-content-between align-items-center mt-auto">
                    <span className="price-tag">{formatPrice(product.price)}</span>
                    <button
                        className="btn btn-dark rounded-circle p-2 quick-add-btn"
                        onClick={handleQuickAdd}
                        disabled={product.stock === 0}
                        title="Quick Add"
                    >
                        <Plus size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
