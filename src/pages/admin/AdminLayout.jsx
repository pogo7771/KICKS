import React, { useEffect, useRef } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { useStore } from '../../context/StoreContext';
import { useNotification } from '../../context/NotificationContext';
import '../../css/admin/AdminLayout.css';

const AdminLayout = () => {
    const { isAdmin, user, logout, settings } = useStore();
    const { showNotification } = useNotification();
    const timeoutRef = useRef(null);

    const handleAutoLogout = React.useCallback(() => {
        logout();
        showNotification('Session timed out due to inactivity.', 'info');
    }, [logout, showNotification]);

    const resetTimer = React.useCallback(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        const duration = (settings?.sessionTimeout || 15) * 60 * 1000;
        timeoutRef.current = setTimeout(() => {
            handleAutoLogout();
        }, duration);
    }, [settings?.sessionTimeout, handleAutoLogout]);

    useEffect(() => {
        if (isAdmin) {
            const events = ['mousedown', 'keypress', 'scroll', 'touchstart'];

            // Throttle the event listener or simply debouncing via resetTimer is fine if not too frequent
            // But to avoid performance issues, let's limit it.
            // Actually, resetting timer on every mousedown is fine, but maybe skip mousemove

            const handleActivity = () => resetTimer();

            events.forEach(event => document.addEventListener(event, handleActivity));
            resetTimer();

            return () => {
                events.forEach(event => document.removeEventListener(event, handleActivity));
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
            };
        }
    }, [isAdmin, resetTimer]);

    if (!isAdmin) {
        return <Navigate to="/admin/login" replace />;
    }

    return (
        <div className="admin-container">
            <AdminSidebar />
            <main className="admin-content-area">
                <header className="admin-header">
                    <div className="header-search">
                        <input type="text" placeholder="Search for products, orders..." />
                    </div>
                    <div className="header-profile">
                        <div className="profile-img">
                            {user?.avatar ? (
                                <img src={user.avatar} alt="" className="w-100 h-100 rounded-circle object-fit-cover" />
                            ) : (
                                (user?.name?.charAt(0) || 'A')
                            )}
                        </div>
                        <span className="profile-name">{user?.name || 'Admin User'}</span>
                    </div>
                </header>
                <div className="admin-main">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
