import React from 'react';
import {
    TrendingUp,
    ShoppingBag,
    Users,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    AlertTriangle,
    PlusCircle,
    Package,
    Activity,
    CreditCard,
    Settings,
    ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import '../../css/admin/AdminDashboard.css';

const AdminDashboard = () => {
    const { products, orders, customers, formatPrice, logs } = useStore();

    const stats = [
        {
            label: 'Total Revenue',
            value: formatPrice((orders || []).reduce((acc, curr) => acc + (curr.amount || 0), 0)),
            icon: DollarSign,
            color: '#3b82f6',
            trend: '+12.5%',
            positive: true
        },
        {
            label: 'Store Orders',
            value: (orders || []).length,
            icon: ShoppingBag,
            color: '#10b981',
            trend: '+5.2%',
            positive: true
        },
        {
            label: 'Inventory Size',
            value: (products || []).length,
            icon: Package,
            color: '#f59e0b',
            trend: '+2.1%',
            positive: true
        },
        {
            label: 'Customer Base',
            value: (customers || []).length,
            icon: Users,
            color: '#8b5cf6',
            trend: '-0.4%',
            positive: false
        },
    ];

    const lowStockProducts = (products || []).filter(p => (p.stock || 24) < 10);

    const quickActions = [
        { title: 'Add Product', icon: PlusCircle, path: '/admin/products', color: 'bg-primary' },
        { title: 'Manage Orders', icon: CreditCard, path: '/admin/orders', color: 'bg-success' },
        { title: 'Customer List', icon: Users, path: '/admin/customers', color: 'bg-info' },
        { title: 'Store Settings', icon: Settings, path: '/admin/settings', color: 'bg-dark' }
    ];

    const generateChartData = () => {
        const points = [40, 65, 55, 80, 70, 95, 85];
        const width = 1000;
        const height = 200;
        const xStep = width / (points.length - 1);
        let d = `M 0 ${height - points[0]}`;
        for (let i = 1; i < points.length; i++) {
            d += ` L ${i * xStep} ${height - points[i]}`;
        }
        return d;
    };

    return (
        <div className="dashboard-container animate-fade-in">
            <div className="dashboard-welcome d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="fw-black mb-1">Business Overview</h1>
                    <p className="text-secondary small mb-0">Your store's performance at a glance.</p>
                </div>
                {lowStockProducts.length > 0 && (
                    <div className="low-stock-pill bg-danger-subtle text-danger px-3 py-2 rounded-pill fw-bold small d-flex align-items-center gap-2">
                        <AlertTriangle size={16} />
                        {lowStockProducts.length} Items Low
                    </div>
                )}
            </div>

            <div className="stats-grid mb-4">
                {stats.map((stat, idx) => (
                    <div key={idx} className="stat-card glass-card border-0 shadow-sm">
                        <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                            <stat.icon size={24} />
                        </div>
                        <div className="stat-info">
                            <span className="stat-label uppercase tracking-wider">{stat.label}</span>
                            <h2 className="stat-value fw-black">{stat.value}</h2>
                            <div className={`stat-trend ${stat.positive ? 'positive' : 'negative'}`}>
                                {stat.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                <span>{stat.trend}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions Row */}
            <div className="row g-3 mb-4">
                {quickActions.map((action, i) => (
                    <div key={i} className="col-md-3">
                        <Link to={action.path} className="text-decoration-none h-100 d-block">
                            <div className="glass-card h-100 p-3 d-flex align-items-center justify-content-between hover-lift">
                                <div className="d-flex align-items-center gap-3">
                                    <div className={`${action.color} text-white p-2 rounded-3 shadow-sm`}>
                                        <action.icon size={20} />
                                    </div>
                                    <span className="fw-bold text-dark">{action.title}</span>
                                </div>
                                <ChevronRight size={16} className="text-secondary" />
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            <div className="dashboard-row g-4">
                <div className="chart-card glass-card flex-grow-1 border-0 shadow-sm">
                    <div className="card-header border-0 mb-4">
                        <div className="d-flex align-items-center gap-2">
                            <TrendingUp size={20} className="text-primary" />
                            <h3 className="h5 fw-black mb-0">Revenue Analytics</h3>
                        </div>
                        <select className="form-select form-select-sm border-0 bg-light rounded-pill px-3">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>
                    <div className="chart-container">
                        <svg width="100%" height="200" viewBox="0 0 1000 200" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path d={generateChartData() + " L 1000 200 L 0 200 Z"} fill="url(#chartGradient)" />
                            <path d={generateChartData()} fill="none" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="d-flex justify-content-between mt-3 text-secondary smaller fw-bold px-2">
                            {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => <span key={day}>{day}</span>)}
                        </div>
                    </div>
                </div>

                <div className="sidebar-card glass-card border-0 shadow-sm">
                    <div className="card-header border-0 mb-4">
                        <div className="d-flex align-items-center gap-2">
                            <Activity size={20} className="text-primary" />
                            <h3 className="h5 fw-black mb-0">Recent Activity</h3>
                        </div>
                    </div>
                    <div className="activity-feed">
                        {[
                            ...(orders || []).map(o => ({
                                type: 'order',
                                text: 'Order Received',
                                details: `#${(o._id || o.id).slice(-6).toUpperCase()}`,
                                date: o.date || 'Today',
                                time: new Date(o.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                icon: ShoppingBag,
                                color: '#3b82f6'
                            })),
                            ...(logs || [])
                                .filter(l => l.event.startsWith('PRODUCT_') || l.event === 'SETTINGS_UPDATE')
                                .map(l => ({
                                    type: 'event',
                                    text: l.event.replace('_', ' '),
                                    details: l.details,
                                    date: new Date(l.createdAt).toLocaleDateString(),
                                    time: new Date(l.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                    icon: Activity,
                                    color: l.event.includes('DELETE') ? '#ef4444' : '#10b981'
                                }))
                        ]
                            .sort((a, b) => new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time))
                            .slice(0, 5)
                            .map((item, idx) => (
                                <div key={idx} className="activity-item pb-3 mb-3 border-bottom last-no-border d-flex gap-3">
                                    <div className="activity-icon-sm p-2 rounded-circle" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                                        <item.icon size={14} />
                                    </div>
                                    <div className="activity-content">
                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                            <span className="activity-text fw-bold">{item.text}</span>
                                            <span className="activity-time text-secondary smaller">{item.time}</span>
                                        </div>
                                        <p className="activity-details text-secondary smaller mb-0 truncate" style={{ maxWidth: '200px' }}>{item.details}</p>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>

            <div className="dashboard-row g-4 mt-2">
                <div className="recent-orders-card glass-card flex-grow-1 border-0 shadow-sm">
                    <div className="card-header border-0 mb-4">
                        <h3 className="h5 fw-black mb-0">Latest Transactions</h3>
                        <Link to="/admin/orders" className="btn btn-light btn-sm rounded-pill px-3 fw-bold">View History</Link>
                    </div>
                    <div className="table-responsive">
                        <table className="admin-table w-100">
                            <thead>
                                <tr className="text-secondary smaller uppercase letter-spacing-1">
                                    <th className="pb-3 px-3">Order ID</th>
                                    <th className="pb-3 px-3">Customer</th>
                                    <th className="pb-3 px-3">Amount</th>
                                    <th className="pb-3 px-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(orders || []).slice(0, 5).map((order) => (
                                    <tr key={order._id || order.id} className="border-top">
                                        <td className="py-3 px-3"><strong>#{(order._id || order.id).slice(-8).toUpperCase()}</strong></td>
                                        <td className="py-3 px-3">{order.customer}</td>
                                        <td className="py-3 px-3 fw-bold text-primary">{formatPrice(order.amount || 0)}</td>
                                        <td className="py-3 px-3">
                                            <span className={`status-badge ${(order.status || 'processing').toLowerCase()} px-3 py-1 rounded-pill small fw-bold`}>
                                                {order.status || 'Processing'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="sidebar-card glass-card border-0 shadow-sm">
                    <div className="card-header border-0 mb-4">
                        <h3 className="h5 fw-black mb-0">Inventory Health</h3>
                    </div>
                    <div className="inventory-list d-grid gap-3">
                        {(products || []).slice(0, 5).map(product => {
                            const stock = product.stock || 24;
                            const isLow = stock < 10;
                            return (
                                <div key={product._id || product.id} className="d-flex align-items-center gap-3">
                                    <img src={product.images?.primary} alt={product.name} className="rounded-3 shadow-sm bg-light" style={{ width: '48px', height: '48px', objectFit: 'cover' }} />
                                    <div className="flex-grow-1">
                                        <span className="d-block fw-bold small text-dark truncate" style={{ maxWidth: '180px' }}>{product.name}</span>
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="progress flex-grow-1" style={{ height: '4px' }}>
                                                <div className={`progress-bar ${isLow ? 'bg-danger' : 'bg-primary'}`} style={{ width: `${Math.min(stock * 4, 100)}%` }}></div>
                                            </div>
                                            <span className={`smaller fw-bold ${isLow ? 'text-danger' : 'text-secondary'}`}>{stock}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
