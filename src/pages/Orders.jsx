import React, { useEffect, useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { Package, ChevronRight, Clock, CheckCircle, Truck, XCircle, ArrowLeft, CreditCard, DollarSign, Calendar, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
    const { user, orders, formatPrice } = useStore();
    const navigate = useNavigate();
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Filter orders for the logged-in user
    const userOrders = useMemo(() => {
        if (!user || !orders) return [];
        return orders.filter(order =>
            order.customer === user.name ||
            order.email === user.email
        ).sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
    }, [user, orders]);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const getStatusStep = (status) => {
        const steps = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
        // Normalize status to match steps
        const currentStatus = status === 'Paid' ? 'Processing' : status;
        const index = steps.findIndex(s => s.toLowerCase() === currentStatus?.toLowerCase());
        return index !== -1 ? index : 0;
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered': return 'success';
            case 'shipped': return 'info';
            case 'cancelled': return 'danger';
            case 'paid': return 'primary';
            default: return 'warning';
        }
    };

    if (!user) return null;

    return (
        <div className="container py-5 animate-fade-in">
            <h1 className="fw-black mb-4">My Orders</h1>

            {selectedOrder ? (
                // Detailed Order View
                <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                    <div className="card-header bg-white border-0 p-4 d-flex justify-content-between align-items-center">
                        <button onClick={() => setSelectedOrder(null)} className="btn btn-light rounded-pill d-flex align-items-center gap-2 fw-bold">
                            <ArrowLeft size={18} /> Back to Orders
                        </button>
                        <div className="text-end">
                            <div className="text-secondary small fw-bold uppercase">Order ID</div>
                            <div className="fw-black fs-5">#{selectedOrder._id ? selectedOrder._id.slice(-6).toUpperCase() : 'ID'}</div>
                        </div>
                    </div>

                    <div className="card-body p-4 p-md-5">
                        {/* Status Timeline */}
                        <div className="mb-5 position-relative">
                            <div className="progress" style={{ height: '4px' }}>
                                <div
                                    className={`progress-bar bg-${getStatusColor(selectedOrder.status)}`}
                                    role="progressbar"
                                    style={{ width: `${(getStatusStep(selectedOrder.status) / 3) * 100}%` }}
                                ></div>
                            </div>
                            <div className="d-flex justify-content-between position-relative" style={{ top: '-14px' }}>
                                {['Processing', 'Shipped', 'Out for Delivery', 'Delivered'].map((step, idx) => {
                                    const currentStep = getStatusStep(selectedOrder.status);
                                    const isCompleted = idx <= currentStep;
                                    const isCurrent = idx === currentStep;

                                    return (
                                        <div key={idx} className="text-center" style={{ width: '80px' }}>
                                            <div
                                                className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 transition-all ${isCompleted ? `bg-${getStatusColor(selectedOrder.status)} text-white shadow` : 'bg-light text-secondary'}`}
                                                style={{ width: '24px', height: '24px', border: isCompleted ? 'none' : '2px solid #e9ecef' }}
                                            >
                                                {isCompleted && <CheckCircle size={14} />}
                                            </div>
                                            <div className={`smaller fw-bold ${isCurrent ? 'text-dark' : 'text-secondary opacity-75'}`}>{step}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="row g-5">
                            <div className="col-lg-8">
                                <h5 className="fw-bold mb-4">Items Ordered</h5>
                                <div className="d-flex flex-column gap-3">
                                    {selectedOrder.items.map((item, idx) => (
                                        <div key={idx} className="d-flex align-items-center gap-4 p-3 bg-light rounded-4">
                                            <div className="bg-white p-2 rounded-3 shadow-sm" style={{ width: '80px', height: '80px' }}>
                                                {/* Placeholder for image if not present in item data */}
                                                <div className="w-100 h-100 bg-secondary-subtle rounded d-flex align-items-center justify-content-center">
                                                    <Package size={24} className="text-secondary opacity-50" />
                                                </div>
                                            </div>
                                            <div className="flex-grow-1">
                                                <h6 className="fw-bold mb-1">{item.name}</h6>
                                                <p className="mb-0 text-secondary small">Size: {item.size} | Qty: {item.quantity}</p>
                                            </div>
                                            <div className="fw-bold fs-5">{formatPrice(item.price * item.quantity)}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="bg-light p-4 rounded-4 h-100">
                                    <h5 className="fw-bold mb-4">Order Summary</h5>

                                    <div className="mb-4">
                                        <div className="text-secondary small fw-bold uppercase mb-2">Shipping Address</div>
                                        <p className="mb-0 fw-medium">
                                            {selectedOrder.customer}<br />
                                            {/* Simulate address if missing in simple order object */}
                                            123 Fashion Street, Suite 404<br />
                                            Mumbai, MH 400001
                                        </p>
                                    </div>

                                    <div className="mb-4">
                                        <div className="text-secondary small fw-bold uppercase mb-2">Payment Method</div>
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="bg-white p-1 rounded border">
                                                {selectedOrder.paymentMethod?.includes('Card') ? <CreditCard size={16} /> : <DollarSign size={16} />}
                                            </div>
                                            <span className="fw-medium">{selectedOrder.paymentMethod || 'Cash on Delivery'}</span>
                                        </div>
                                    </div>

                                    <hr className="border-secondary opacity-10 my-4" />

                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="text-secondary">Subtotal</span>
                                        <span className="fw-bold">{formatPrice(selectedOrder.amount)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <span className="text-secondary">Shipping</span>
                                        <span className="text-success fw-bold">Free</span>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                                        <span className="fs-5 fw-black">Total</span>
                                        <span className="fs-4 fw-black text-primary">{formatPrice(selectedOrder.amount)}</span>
                                    </div>

                                    <a href="mailto:support@kicks.com" className="btn btn-outline-dark w-100 rounded-pill mt-4 fw-bold">
                                        Need Help?
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // Orders List
                <div className="d-flex flex-column gap-4">
                    {userOrders.length === 0 ? (
                        <div className="text-center py-5">
                            <div className="bg-light rounded-circle d-inline-flex p-4 mb-4 text-secondary">
                                <Package size={48} />
                            </div>
                            <h3>No orders found</h3>
                            <button onClick={() => navigate('/shop')} className="btn btn-primary rounded-pill mt-3 px-4">Start Shopping</button>
                        </div>
                    ) : (
                        userOrders.map(order => (
                            <div key={order._id || order.id} className="card border-0 shadow-sm rounded-4 overflow-hidden hover-lift transition-all">
                                <div className="card-body p-4 d-flex flex-column flex-md-row align-items-center gap-4">
                                    <div className="p-3 bg-light rounded-3 d-flex align-items-center justify-content-center text-primary">
                                        <Package size={32} />
                                    </div>

                                    <div className="flex-grow-1 text-center text-md-start">
                                        <h5 className="fw-bold mb-1">Order #{order._id ? order._id.slice(-6).toUpperCase() : 'ID'}</h5>
                                        <div className="d-flex flex-wrap justify-content-center justify-content-md-start gap-3 text-secondary small">
                                            <span className="d-flex align-items-center gap-1">
                                                <Calendar size={14} />
                                                {new Date(order.createdAt || order.date).toLocaleDateString()}
                                            </span>
                                            <span className="d-flex align-items-center gap-1">
                                                <ShoppingBag size={14} />
                                                {order.items?.length || 0} Items
                                            </span>
                                        </div>
                                    </div>

                                    <div className="text-center text-md-end">
                                        <div className="fs-5 fw-black text-primary mb-1">{formatPrice(order.amount)}</div>
                                        <div className={`badge rounded-pill bg-${getStatusColor(order.status)}-subtle text-${getStatusColor(order.status)} px-3`}>
                                            {order.status || 'Processing'}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setSelectedOrder(order)}
                                        className="btn btn-dark rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2"
                                    >
                                        Track Order <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Orders;
