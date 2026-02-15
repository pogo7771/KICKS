import React from 'react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../css/Cart.css';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
    const { formatPrice } = useStore();

    if (cart.length === 0) {
        return (
            <div className="container py-5 text-center cart-empty">
                <h2 className="display-5 fw-bold mb-3">Your Bag is Empty</h2>
                <p className="text-muted mb-4">Looks like you haven't added any shoes yet.</p>
                <Link to="/shop" className="btn btn-primary btn-lg">Start Shopping</Link>
            </div>
        );
    }

    return (
        <div className="container py-5 cart-page">
            <h1 className="mb-4">Shopping Bag ({cart.length} items)</h1>
            <div className="row g-5">
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-0">
                            {cart.map((item) => (
                                <div key={`${item.id || item._id}-${item.size}`} className="row g-0 border-bottom p-3 align-items-center">
                                    <div className="col-3 col-md-2">
                                        <img
                                            src={item.images?.primary}
                                            alt={item.name}
                                            className="img-fluid rounded"
                                            style={{ objectFit: 'cover', aspectRatio: '1' }}
                                        />
                                    </div>
                                    <div className="col-9 col-md-10 ps-3">
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div>
                                                <h5 className="mb-1 fw-bold">{item.name}</h5>
                                                <p className="text-secondary small mb-1">{item.brand} | Size: {item.size}</p>
                                                <p className="fw-bold text-primary">{formatPrice(item.price)}</p>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id || item._id, item.size)}
                                                className="btn btn-link text-danger p-0"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                        <div className="d-flex align-items-center gap-3 mt-2">
                                            <div className="input-group input-group-sm" style={{ width: '120px' }}>
                                                <button
                                                    className="btn btn-outline-secondary"
                                                    onClick={() => updateQuantity(item.id || item._id, item.size, item.quantity - 1)}
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="form-control text-center bg-white">{item.quantity}</span>
                                                <button
                                                    className="btn btn-outline-secondary"
                                                    onClick={() => updateQuantity(item.id || item._id, item.size, item.quantity + 1)}
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-4">
                            <h4 className="mb-3">Order Summary</h4>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-secondary">Subtotal</span>
                                <span className="fw-bold">{formatPrice(cartTotal)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-secondary">Shipping</span>
                                <span className="text-success">Free</span>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between mb-4">
                                <span className="fs-5 fw-bold">Total</span>
                                <span className="fs-5 fw-bold text-primary">{formatPrice(cartTotal)}</span>
                            </div>
                            <Link to="/checkout" className="btn btn-dark w-100 btn-lg d-flex justify-content-between align-items-center">
                                <span>Checkout</span>
                                <ArrowRight size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
