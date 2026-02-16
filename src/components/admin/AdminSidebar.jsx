import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    ShoppingBag,
    ClipboardList,
    Users,
    Settings,
    LogOut,
    Home,
    Ticket,
    MessageSquare
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import '../../css/admin/AdminSidebar.css';

const AdminSidebar = () => {
    const { logout: adminLogout, orders, products } = useStore();


    const pendingOrdersCount = (orders || []).filter(o => o.status === 'Processing' || o.status === 'Pending').length;
    const lowStockCount = (products || []).filter(p => (p.stock || 24) < 10).length;
    const reviewCount = (products || []).reduce((acc, p) => acc + (p.reviews?.length || 0), 0);

    const menuItems = [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/products', icon: ShoppingBag, label: 'Products', badge: lowStockCount > 0 ? lowStockCount : null, badgeClass: 'bg-danger text-white' },
        { path: '/admin/orders', icon: ClipboardList, label: 'Orders', badge: pendingOrdersCount > 0 ? pendingOrdersCount : null, badgeClass: 'bg-primary text-white' },
        { path: '/admin/customers', icon: Users, label: 'Customers' },
        { path: '/admin/reviews', icon: MessageSquare, label: 'Reviews', badge: reviewCount > 0 ? reviewCount : null, badgeClass: 'bg-warning text-dark' },
        { path: '/admin/coupons', icon: Ticket, label: 'Coupons' },
        { path: '/admin/settings', icon: Settings, label: 'Configs' },
    ];

    return (
        <aside className="admin-sidebar">
            <div className="sidebar-header">
                <div className="logo">
                    <ShoppingBag className="logo-icon" />
                    <span>Store Admin</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                <div className="nav-group">
                    <small className="nav-label">MAIN MENU</small>
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                            {item.badge && (
                                <span className={`nav-badge ${item.badgeClass}`}>{item.badge}</span>
                            )}
                        </NavLink>
                    ))}
                </div>

                <div className="nav-group mt-auto">
                    <small className="nav-label">SYSTEM</small>
                    <NavLink to="/" className="nav-link">
                        <Home size={20} />
                        <span>View Website</span>
                    </NavLink>
                    <button onClick={adminLogout} className="nav-link logout-btn">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </nav>
        </aside>
    );
};

export default AdminSidebar;
