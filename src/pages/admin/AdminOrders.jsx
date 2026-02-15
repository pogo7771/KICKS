import React, { useState } from 'react';
import {
    Search,
    Eye,
    X,
    Download,
    Package,
    User,
    Calendar,
    CreditCard,
    MapPin,
    Truck,
    CheckCircle,
    Copy,
    ExternalLink,
    AlertCircle
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useNotification } from '../../context/NotificationContext';
import '../../css/admin/AdminOrders.css';

const AdminOrders = () => {
    const { orders, updateOrderStatus, formatPrice } = useStore();
    const { showNotification } = useNotification();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [updatingOrderId, setUpdatingOrderId] = useState(null);

    const getStatusClass = (status) => {
        switch ((status || 'processing').toLowerCase()) {
            case 'delivered': return 'status-delivered';
            case 'processing': return 'status-processing';
            case 'shipped': return 'status-shipped';
            case 'cancelled': return 'status-cancelled';
            default: return '';
        }
    };

    const filteredOrders = orders.filter(order =>
        (order._id || order.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCopyId = (id) => {
        navigator.clipboard.writeText(id);
        showNotification('Order ID copied to clipboard', 'info');
    };

    const handleGenerateReport = () => {
        if (orders.length === 0) {
            showNotification('No orders available to export', 'error');
            return;
        }

        // CSV Header
        const headers = ['Order ID', 'Customer', 'Date', 'Amount', 'Status', 'Items Count'];

        // CSV Rows
        const rows = orders.map(order => [
            order._id || order.id,
            order.customer,
            order.date || 'N/A',
            order.amount,
            order.status,
            (order.items || []).length
        ]);

        // Combine into CSV string
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `Kicks_Orders_Report_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showNotification('Order report generated and downloaded', 'success');
    };

    return (
        <div className="admin-orders-container">
            <div className="page-header">
                <div>
                    <h1>Orders Management</h1>
                    <p>Track shipments, update statuses and review sales</p>
                </div>
                <button
                    className="export-btn d-flex align-items-center gap-2 shadow-sm"
                    onClick={handleGenerateReport}
                >
                    <Download size={18} />
                    <span>Generate Report</span>
                </button>
            </div>

            <div className="content-card shadow-sm border-0">
                <div className="table-actions">
                    <div className="search-box">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search by Order ID or Customer name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Order Identity</th>
                                <th>Customer Information</th>
                                <th>Purchase Date</th>
                                <th>Inventory Items</th>
                                <th>Total Revenue</th>
                                <th>Shipment Status</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order) => (
                                <tr key={order._id || order.id}>
                                    <td>
                                        <div className="d-flex align-items-center gap-2">
                                            <code className="id-badge cursor-pointer" onClick={() => handleCopyId(order._id || order.id)}>
                                                #{(order._id || order.id).slice(-8).toUpperCase()}
                                            </code>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="bg-light rounded-circle p-1"><User size={14} className="text-secondary" /></div>
                                            <span className="fw-600">{order.customer}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center gap-2 text-secondary smaller">
                                            <Calendar size={14} />
                                            {order.date || 'Today'}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge bg-light text-dark border">
                                            {(order.items || []).length} Product{(order.items || []).length !== 1 ? 's' : ''}
                                        </span>
                                    </td>
                                    <td><span className="fw-bold text-success">{formatPrice(order.amount || 0)}</span></td>
                                    <td>
                                        <div className="position-relative">
                                            <select
                                                className={`status-select ${getStatusClass(order.status)}`}
                                                value={order.status}
                                                disabled={updatingOrderId === (order._id || order.id)}
                                                onChange={async (e) => {
                                                    const currentId = order._id || order.id;
                                                    setUpdatingOrderId(currentId);
                                                    const res = await updateOrderStatus(currentId, e.target.value);
                                                    setUpdatingOrderId(null);
                                                    if (res.success) {
                                                        showNotification(`Order status updated to ${e.target.value}`, 'success');
                                                    }
                                                }}
                                            >
                                                <option value="Processing">Processing</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                            {updatingOrderId === (order._id || order.id) && (
                                                <div className="status-updating-overlay">
                                                    <span className="spinner-border spinner-border-sm" />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <button className="view-order-btn" onClick={() => setSelectedOrder(order)}>
                                            <Eye size={16} className="me-1" />
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedOrder && (
                <div className="modal-overlay">
                    <div className="order-detail-modal shadow-lg">
                        <div className="order-modal-header">
                            <div className="d-flex align-items-center gap-3">
                                <div className="bg-primary text-white p-2 rounded-lg"><Package size={24} /></div>
                                <div>
                                    <h3 className="mb-0">Order #{(selectedOrder._id || selectedOrder.id).toUpperCase()}</h3>
                                    <span className="text-secondary smaller">Transaction details and shipment tracking</span>
                                </div>
                            </div>
                            <button className="close-btn p-2 hover-bg-light rounded-circle" onClick={() => setSelectedOrder(null)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="order-modal-content">
                            <div className="order-info-grid">
                                <div className="info-item">
                                    <span className="info-label d-flex align-items-center gap-1"><User size={12} /> Customer</span>
                                    <span className="info-value">{selectedOrder.customer}</span>
                                    <span className="smaller text-secondary">ID: USER-92182</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label d-flex align-items-center gap-1"><Calendar size={12} /> Ordered On</span>
                                    <span className="info-value">{selectedOrder.date || 'Feb 12, 2026'}</span>
                                    <span className="smaller text-secondary">Time: 14:32:01</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label d-flex align-items-center gap-1"><CreditCard size={12} /> Payment</span>
                                    <span className="info-value text-success">Paid via UPI</span>
                                    <span className="smaller text-secondary">Ref: txn_9210481BW</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label d-flex align-items-center gap-1"><MapPin size={12} /> Shipping To</span>
                                    <span className="info-value">Mumbai, Maharashtra</span>
                                    <span className="smaller text-secondary">Express Delivery</span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h4 className="mb-3 d-flex align-items-center gap-2">
                                    <Package size={20} className="text-primary" />
                                    Order Items ({(selectedOrder.items || []).length})
                                </h4>
                                <div className="order-items-list">
                                    {(selectedOrder.items || []).length > 0 ? (
                                        selectedOrder.items.map((item, idx) => (
                                            <div key={idx} className="order-item-row hover-shadow-sm transition">
                                                <img src={item.image || 'https://via.placeholder.com/60'} alt="" className="order-item-img border" />
                                                <div className="order-item-info">
                                                    <div className="order-item-name">{item.name || 'Premium Sneaker'}</div>
                                                    <div className="order-item-meta">Size: UK 9 | Qty: {item.quantity || 1}</div>
                                                </div>
                                                <div className="order-item-price">{formatPrice(item.price || 0)}</div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-4 bg-light rounded-lg">
                                            <AlertCircle className="text-secondary opacity-50 mb-2" />
                                            <p className="text-secondary mb-0">No item details available for this legacy order.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="order-summary-box">
                                <div className="summary-row">
                                    <span className="text-secondary">Subtotal:</span>
                                    <span className="fw-600">{formatPrice(selectedOrder.amount - 150)}</span>
                                </div>
                                <div className="summary-row">
                                    <span className="text-secondary">Shipping:</span>
                                    <span className="fw-600">{formatPrice(0)}</span>
                                </div>
                                <div className="summary-row summary-total border-top pt-2">
                                    <span>Total:</span>
                                    <span>{formatPrice(selectedOrder.amount || 0)}</span>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-top d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="d-flex align-items-center gap-1 smaller fw-bold text-primary">
                                        <Truck size={16} />
                                        TRACK SHIPMENT
                                    </div>
                                    <div className="d-flex align-items-center gap-1 smaller fw-bold text-success">
                                        <CheckCircle size={16} />
                                        VERIFIED ORDER
                                    </div>
                                </div>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-outline-primary btn-sm rounded-pill px-4">Download Invoice</button>
                                    <button className="btn btn-primary btn-sm rounded-pill px-4" onClick={() => setSelectedOrder(null)}>Done</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
