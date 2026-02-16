import React, { useState } from 'react';
import {
    Ticket,
    Plus,
    Search,
    Trash2,
    Calendar,
    Percent,
    DollarSign,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useNotification } from '../../context/NotificationContext';

const AdminCoupons = () => {
    const { coupons, addCoupon, deleteCoupon, formatPrice, settings } = useStore();
    const { showNotification } = useNotification();
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        type: 'percentage',
        value: '',
        minPurchase: '',
        expiryDate: ''
    });

    const filteredCoupons = (coupons || []).filter(c =>
        c.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        const couponData = {
            ...formData,
            code: formData.code.toUpperCase(),
            value: parseFloat(formData.value),
            minPurchase: parseFloat(formData.minPurchase) || 0
        };

        const result = await addCoupon(couponData);
        if (result.success) {
            setShowModal(false);
            showNotification('Coupon created successfully', 'success');
            setFormData({ code: '', type: 'percentage', value: '', minPurchase: '', expiryDate: '' });
        } else {
            showNotification(result.message || 'Failed to create coupon', 'error');
        }
    };

    return (
        <div className="admin-orders-container"> {/* Reusing container styles */}
            <div className="page-header">
                <div>
                    <h1>Coupons & Discounts</h1>
                    <p>Manage promo codes and marketing campaigns</p>
                </div>
                <button className="add-product-btn" onClick={() => setShowModal(true)}>
                    <Plus size={20} />
                    <span>Create Coupon</span>
                </button>
            </div>

            <div className="content-card">
                <div className="table-actions">
                    <div className="search-box">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search by code..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Discount</th>
                                <th>Min. Purchase</th>
                                <th>Status</th>
                                <th>Expiry</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCoupons.map((coupon) => (
                                <tr key={coupon._id}>
                                    <td>
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="bg-light p-2 rounded-circle">
                                                <Ticket size={16} className="text-primary" />
                                            </div>
                                            <span className="fw-bold text-primary">{coupon.code}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center gap-1 fw-bold">
                                            {coupon.type === 'percentage' ? <Percent size={14} /> : <DollarSign size={14} />}
                                            {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `${formatPrice(coupon.value)} OFF`}
                                        </div>
                                    </td>
                                    <td>
                                        {formatPrice(coupon.minPurchase || 0)}
                                    </td>
                                    <td>
                                        {new Date(coupon.expiryDate) < new Date() ? (
                                            <span className="badge bg-danger-subtle text-danger">Expired</span>
                                        ) : (
                                            <span className="badge bg-success-subtle text-success">Active</span>
                                        )}
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center gap-2 text-secondary smaller">
                                            <Calendar size={14} />
                                            {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : 'No Expiry'}
                                        </div>
                                    </td>
                                    <td>
                                        <button className="action-btn delete" onClick={async () => {
                                            if (window.confirm('Delete this coupon?')) {
                                                await deleteCoupon(coupon._id);
                                                showNotification('Coupon deleted', 'info');
                                            }
                                        }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredCoupons.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center py-5 text-secondary">
                                        No coupons found. Create one to get started!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="admin-modal" style={{ maxWidth: '500px' }}>
                        <div className="modal-header">
                            <div>
                                <h2>Create New Coupon</h2>
                                <p className="text-secondary smaller mb-0">Set up a new discount code.</p>
                            </div>
                            <button className="close-btn" onClick={() => setShowModal(false)}>
                                <XCircle size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-group">
                                <label>Coupon Code</label>
                                <input
                                    type="text"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    placeholder="e.g. SUMMER25"
                                    required
                                    className="fw-bold letter-spacing-1"
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group flex-1">
                                    <label>Discount Type</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount ({settings?.currency?.split(' ')?.[1] || '₹'})</option>
                                    </select>
                                </div>
                                <div className="form-group flex-1">
                                    <label>Value</label>
                                    <input
                                        type="number"
                                        value={formData.value}
                                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                        required
                                        min="0"
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group flex-1">
                                    <label>Min. Purchase Amount</label>
                                    <input
                                        type="number"
                                        value={formData.minPurchase}
                                        onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })}
                                        min="0"
                                    />
                                </div>
                                <div className="form-group flex-1">
                                    <label>Expiry Date</label>
                                    <input
                                        type="date"
                                        value={formData.expiryDate}
                                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="submit-btn">Create Coupon</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCoupons;
