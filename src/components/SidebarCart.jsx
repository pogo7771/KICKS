import React, { useEffect } from 'react';
import { X, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import '../css/SidebarCart.css';

const SidebarCart = ({ isOpen, onClose }) => {
    const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
    const { formatPrice } = useStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    const handleCheckout = () => {
        onClose();
        navigate('/checkout');
    };

    if (!isOpen) return null;

    return (
        <div className="sidebar-cart-overlay" onClick={onClose}>
            <div className="sidebar-cart" onClick={e => e.stopPropagation()}>
                <div className="sidebar-cart-header">
                    <div className="d-flex align-items-center gap-2">
                        <ShoppingBag size={24} />
                        <h4 className="mb-0 fw-bold">Your Bag ({cart.length})</h4>
                    </div>
                    <button className="btn btn-link text-dark p-0" onClick={onClose}>
                        <X size={28} />
                    </button>
                </div>

                <div className="sidebar-cart-content">
                    {cart.length === 0 ? (
                        <div className="empty-cart text-center py-5">
                            <p className="lead text-secondary">Your bag is empty.</p>
                            <Link to="/shop" className="btn btn-dark px-4" onClick={onClose}>
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="cart-items-list">
                            {cart.map((item) => (
                                <div key={`${item.id || item._id}-${item.size}`} className="cart-item">
                                    <div className="cart-item-image">
                                        <img src={item.images.primary} alt={item.name} />
                                    </div>
                                    <div className="cart-item-details">
                                        <div className="d-flex justify-content-between align-items-start">
                                            <h6 className="mb-1 fw-bold">{item.name}</h6>
                                            <button
                                                className="btn btn-link text-danger p-0 border-0"
                                                onClick={() => removeFromCart(item.id || item._id, item.size)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <p className="small text-secondary mb-2">Size: {item.size}</p>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="quantity-controls">
                                                <button onClick={() => updateQuantity(item.id || item._id, item.size, item.quantity - 1)}>-</button>
                                                <span>{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id || item._id, item.size, item.quantity + 1)}>+</button>
                                            </div>
                                            <span className="fw-bold">{formatPrice(item.price * item.quantity)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="sidebar-cart-footer">
                        <div className="d-flex justify-content-between mb-3">
                            <span className="text-secondary">Subtotal</span>
                            <span className="fw-bold h5 mb-0">{formatPrice(cartTotal)}</span>
                        </div>
                        <button className="btn btn-dark w-100 btn-lg mb-2 d-flex align-items-center justify-content-center gap-2" onClick={handleCheckout}>
                            Checkout <ArrowRight size={20} />
                        </button>
                        <Link to="/cart" className="btn btn-link w-100 text-dark text-decoration-none text-center h6 mb-0" onClick={onClose}>
                            View Shopping Bag
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SidebarCart;
