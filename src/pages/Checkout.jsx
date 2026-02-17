import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { useNotification } from '../context/NotificationContext';
import PaymentForm from '../components/PaymentForm';
import '../css/Checkout.css';

const Checkout = () => {
    const { cart, cartTotal, clearCart } = useCart();
    const { user, addOrder, formatPrice, validateCoupon } = useStore();
    const { showNotification } = useNotification();
    const navigate = useNavigate();
    const [clientSecret, setClientSecret] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Coupon State
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState(null);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        country: 'India',
        state: 'Maharashtra',
        zip: ''
    });

    // Calculate final total
    const finalTotal = Math.max(0, cartTotal - discount);

    // Initialize Stripe
    const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "pk_test_TYooMQauvdEDq54NiTphI7jx");

    useEffect(() => {
        // Create PaymentIntent as soon as the page loads
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        fetch(`${API_URL}/create-payment-intent`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" },
            body: JSON.stringify({ amount: finalTotal, currency: 'inr' }),
        })
            .then((res) => res.json())
            .then((data) => setClientSecret(data.clientSecret))
            .catch((err) => console.error("Error fetching payment intent", err));
    }, [cartTotal, finalTotal]); // Re-run when total changes

    const handleApplyCoupon = async (e) => {
        e.preventDefault();
        if (!couponCode.trim()) return;

        const result = await validateCoupon(couponCode, cartTotal);
        if (result.success) {
            setDiscount(result.discount);
            setAppliedCoupon(result.coupon);
            showNotification(`Coupon applied: ${formatPrice(result.discount)} OFF`, 'success');
        } else {
            setDiscount(0);
            setAppliedCoupon(null);
            showNotification(result.message || 'Invalid coupon', 'error');
        }
    };

    const handlePlaceOrder = (e) => {
        e.preventDefault();

        // Validation
        if (!formData.firstName || !formData.address || !formData.zip) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        addOrder({
            customer: `${formData.firstName} ${formData.lastName}`,
            email: user?.email || formData.email,
            userId: user?._id || user?.id,
            amount: finalTotal,
            status: 'Processing',
            paymentMethod: paymentMethod === 'card' ? 'Credit Card (Stripe)' : (paymentMethod === 'razorpay' ? 'UPI (Razorpay)' : 'COD'),
            items: cart.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                size: item.size
            })),
            discount: discount,
            coupon: appliedCoupon ? appliedCoupon.code : null
        });

        if (paymentMethod === 'razorpay') {
            window.open('https://razorpay.me/@sachin7820', '_blank');
        }

        setIsSuccess(true);
        clearCart();
        showNotification('Order placed successfully!', 'success');
        setTimeout(() => navigate('/orders'), 3000);
    };

    const handleStripeSuccess = (paymentIntent) => {
        // Only called on successful card payment
        addOrder({
            customer: `${formData.firstName} ${formData.lastName}`,
            amount: cartTotal,
            status: 'Paid',
            paymentMethod: 'Credit Card (Stripe)',
            paymentId: paymentIntent.id,
            items: cart.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                size: item.size
            }))
        });

        setIsSuccess(true);
        clearCart();
        showNotification('Payment successful! Order confirmed.', 'success');
        setTimeout(() => navigate('/orders'), 3000);
    };

    if (isSuccess) {
        return (
            <div className="container py-5 my-5 text-center animate-fade-in">
                <div className="mb-4">
                    <CheckCircle size={80} className="text-success" />
                </div>
                <h1 className="display-4 fw-black mb-3">Order Confirmed!</h1>
                <p className="lead text-secondary mb-4">Thank you for your purchase. Your order is being processed.</p>
                <div className="d-flex justify-content-center gap-3">
                    <Link to="/orders" className="btn btn-primary btn-lg rounded-pill px-4">Track Order</Link>
                    <Link to="/" className="btn btn-outline-dark btn-lg rounded-pill px-4">Home</Link>
                </div>
            </div>
        );
    }

    if (!cart || cart.length === 0) {
        return (
            <div className="container py-5 text-center">
                <h2 className="fw-black">Your bag is empty</h2>
                <Link to="/shop" className="btn btn-primary btn-lg rounded-pill mt-3 px-5">Start Shopping</Link>
            </div>
        )
    }

    const appearance = {
        theme: 'stripe',
        variables: {
            colorPrimary: '#0d6efd',
        },
    };
    const options = {
        clientSecret,
        appearance,
    };

    return (
        <div className="container py-5 checkout-page">
            <h1 className="mb-4">Checkout</h1>
            <div className="row g-5">
                <div className="col-md-5 col-lg-4 order-md-last">
                    <h4 className="d-flex justify-content-between align-items-center mb-3">
                        <span className="text-primary">Your cart</span>
                        <span className="badge bg-primary rounded-pill">{(cart || []).reduce((count, item) => count + item.quantity, 0)}</span>
                    </h4>
                    <ul className="list-group mb-3">
                        {cart.map((item) => (
                            <li key={`${item.id}-${item.size}`} className="list-group-item d-flex justify-content-between lh-sm">
                                <div>
                                    <h6 className="my-0">{item.name}</h6>
                                    <small className="text-muted">Size: {item.size} | Qty: {item.quantity}</small>
                                </div>
                                <span className="text-muted">{formatPrice(item.price * item.quantity)}</span>
                            </li>
                        ))}

                        {discount > 0 && (
                            <li className="list-group-item d-flex justify-content-between bg-light text-success">
                                <div className="d-flex flex-column">
                                    <span>Discount (Coupon: {appliedCoupon?.code})</span>
                                    <small className="cursor-pointer text-decoration-underline" onClick={() => {
                                        setDiscount(0);
                                        setAppliedCoupon(null);
                                        setCouponCode('');
                                    }}>Remove</small>
                                </div>
                                <strong>-{formatPrice(discount)}</strong>
                            </li>
                        )}
                        <li className="list-group-item d-flex justify-content-between">
                            <span>Total (INR)</span>
                            <strong>{formatPrice(finalTotal)}</strong>
                        </li>
                    </ul>

                    <form className="card p-2" onSubmit={handleApplyCoupon}>
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Promo code"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                disabled={discount > 0}
                            />
                            <button type="submit" className="btn btn-secondary" disabled={discount > 0 || !couponCode}>Redeem</button>
                        </div>
                    </form>
                </div>
                <div className="col-md-7 col-lg-8">
                    <h4 className="mb-3">Billing address</h4>
                    <form className="needs-validation" onSubmit={handlePlaceOrder}>
                        <div className="row g-3">
                            <div className="col-sm-6">
                                <label htmlFor="firstName" className="form-label">First name</label>
                                <input type="text" className="form-control" id="firstName" name="firstName" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} required />
                            </div>

                            <div className="col-sm-6">
                                <label htmlFor="lastName" className="form-label">Last name</label>
                                <input type="text" className="form-control" id="lastName" name="lastName" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} required />
                            </div>

                            <div className="col-12">
                                <label htmlFor="email" className="form-label">Email <span className="text-muted">(Optional)</span></label>
                                <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="you@example.com" />
                            </div>

                            <div className="col-12">
                                <label htmlFor="address" className="form-label">Address</label>
                                <input type="text" className="form-control" id="address" name="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="1234 Main St" required />
                            </div>

                            <div className="col-md-5">
                                <label htmlFor="country" className="form-label">Country</label>
                                <select className="form-select" id="country" name="country" value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} required>
                                    <option value="">Choose...</option>
                                    <option>India</option>
                                </select>
                            </div>

                            <div className="col-md-4">
                                <label htmlFor="state" className="form-label">State</label>
                                <select className="form-select" id="state" name="state" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} required>
                                    <option value="">Choose...</option>
                                    <option>Maharashtra</option>
                                    <option>Delhi</option>
                                    <option>Karnataka</option>
                                </select>
                            </div>

                            <div className="col-md-3">
                                <label htmlFor="zip" className="form-label">Zip</label>
                                <input type="text" className="form-control" id="zip" name="zip" value={formData.zip} onChange={(e) => setFormData({ ...formData, zip: e.target.value })} required />
                            </div>
                        </div>

                        <hr className="my-4" />

                        <div className="form-check">
                            <input type="checkbox" className="form-check-input" id="same-address" />
                            <label className="form-check-label" htmlFor="same-address">Shipping address is the same as my billing address</label>
                        </div>

                        <div className="form-check">
                            <input type="checkbox" className="form-check-input" id="save-info" />
                            <label className="form-check-label" htmlFor="save-info">Save this information for next time</label>
                        </div>

                        <hr className="my-4" />

                        <h4 className="mb-3">Payment Method</h4>

                        <div className="my-3">
                            <div className="form-check mb-2">
                                <input
                                    id="credit"
                                    name="paymentMethod"
                                    type="radio"
                                    className="form-check-input"
                                    checked={paymentMethod === 'card'}
                                    onChange={() => setPaymentMethod('card')}
                                />
                                <label className="form-check-label fw-bold" htmlFor="credit">Credit / Debit Card (Stripe)</label>
                            </div>

                            {/* Stripe Elements Form */}
                            {paymentMethod === 'card' && clientSecret && (
                                <div className="card p-3 mb-3 border-primary bg-light">
                                    <Elements options={options} stripe={stripePromise}>
                                        <PaymentForm onPaymentSuccess={handleStripeSuccess} isLoading={isProcessing} />
                                    </Elements>
                                </div>
                            )}

                            <div className="form-check mb-2">
                                <input
                                    id="razorpay"
                                    name="paymentMethod"
                                    type="radio"
                                    className="form-check-input"
                                    checked={paymentMethod === 'razorpay'}
                                    onChange={() => setPaymentMethod('razorpay')}
                                />
                                <label className="form-check-label fw-bold text-primary" htmlFor="razorpay">
                                    UPI / Pay via Razorpay
                                </label>
                            </div>

                            <div className="form-check mb-2">
                                <input
                                    id="cod"
                                    name="paymentMethod"
                                    type="radio"
                                    className="form-check-input"
                                    checked={paymentMethod === 'cod'}
                                    onChange={() => setPaymentMethod('cod')}
                                />
                                <label className="form-check-label" htmlFor="cod">Cash on Delivery</label>
                            </div>
                        </div>

                        <hr className="my-4" />

                        {paymentMethod !== 'card' && (
                            <button className="w-100 btn btn-primary btn-lg" type="submit">
                                {paymentMethod === 'razorpay' ? 'Place Order & Pay' : 'Place Order (COD)'}
                            </button>
                        )}

                        {paymentMethod === 'card' && !clientSecret && (
                            <div className="alert alert-warning">
                                Loading secure payment gateway... (Requires backend configuration)
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
