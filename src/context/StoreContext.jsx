import React, { createContext, useContext, useState, useEffect } from 'react';

const StoreContext = createContext();

export const useStore = () => useContext(StoreContext);

export const StoreProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('store_user');
        return saved ? JSON.parse(saved) : null;
    });
    const [settings, setSettings] = useState({
        storeName: 'KICKS.',
        storeEmail: 'admin@store.com',
        currency: 'INR (₹) - Indian Rupee',
        timezone: '(GMT+05:30) IST - Kolkata'
    });
    const [logs, setLogs] = useState([]);

    const [rates, setRates] = useState({ USD: 0.012, EUR: 0.011 }); // Fallback rates

    const isAdmin = user?.isAdmin || false;
    const API_URL = import.meta.env.VITE_API_URL || 'https://kicks-backend-x6vc.onrender.com/api';
    console.log("StoreContext initialized, API_URL:", API_URL);

    // Fetch products, orders, customers, settings and exchange rates on mount
    useEffect(() => {
        const fetchData = async (showLoading = true) => {
            if (showLoading) setLoading(true);
            try {
                // Parallel fetching for performance and fault tolerance
                const [prodRes, orderRes, userRes, settingsRes, logsRes] = await Promise.allSettled([
                    fetch(`${API_URL}/products`, { headers: { 'ngrok-skip-browser-warning': 'true' } }),
                    fetch(`${API_URL}/orders`, { headers: { 'ngrok-skip-browser-warning': 'true' } }),
                    fetch(`${API_URL}/users`, { headers: { 'ngrok-skip-browser-warning': 'true' } }),
                    fetch(`${API_URL}/settings`, { headers: { 'ngrok-skip-browser-warning': 'true' } }),
                    fetch(`${API_URL}/security/logs`, { headers: { 'ngrok-skip-browser-warning': 'true' } })
                ]);

                // Handle Products
                if (prodRes.status === 'fulfilled' && prodRes.value.ok) {
                    try {
                        const prodData = await prodRes.value.json();
                        if (Array.isArray(prodData)) setProducts(prodData);
                    } catch (e) {
                        console.warn('Failed to parse products', e);
                    }
                }

                // Handle Orders
                if (orderRes.status === 'fulfilled' && orderRes.value.ok) {
                    try {
                        const orderData = await orderRes.value.json();
                        if (Array.isArray(orderData)) setOrders(orderData);
                    } catch (e) {
                        console.warn('Failed to parse orders', e);
                    }
                }

                // Handle Users
                if (userRes.status === 'fulfilled' && userRes.value.ok) {
                    try {
                        const userData = await userRes.value.json();
                        if (Array.isArray(userData)) setCustomers(userData);
                    } catch (e) {
                        console.warn('Failed to parse users', e);
                    }
                }

                // Handle Settings
                if (settingsRes.status === 'fulfilled' && settingsRes.value.ok) {
                    try {
                        const settingsData = await settingsRes.value.json();
                        if (settingsData && !settingsData.message) setSettings(settingsData);
                    } catch (e) {
                        console.warn('Failed to parse settings', e);
                    }
                }

                // Handle Logs
                if (logsRes.status === 'fulfilled' && logsRes.value.ok) {
                    try {
                        const logsData = await logsRes.value.json();
                        if (Array.isArray(logsData)) setLogs(logsData);
                    } catch (e) {
                        console.warn('Failed to parse logs', e);
                    }
                }

                // Fetch real-time exchange rates (only once or less frequently)
                if (showLoading) {
                    try {
                        const ratesRes = await fetch('https://api.exchangerate-api.com/v4/latest/INR');
                        const ratesData = await ratesRes.json();
                        if (ratesData && ratesData.rates) {
                            setRates({
                                USD: ratesData.rates.USD,
                                EUR: ratesData.rates.EUR
                            });
                        }
                    } catch (e) {
                        // Silent fail for rates
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                if (showLoading) setLoading(false);
            }
        };

        fetchData();

        // Real-time polling every 10 seconds for admin panel
        const pollInterval = setInterval(() => {
            fetchData(false); // Fetch without showing loading spinner
        }, 10000);

        return () => clearInterval(pollInterval);
    }, []);

    // Helper to format currency symbol and conversion
    const getCurrencyConfig = () => {
        const curr = settings.currency || '';
        if (curr.includes('USD')) return { symbol: '$', rate: rates.USD, locale: 'en-US' };
        if (curr.includes('EUR')) return { symbol: '€', rate: rates.EUR, locale: 'en-DE' };
        return { symbol: '₹', rate: 1, locale: 'en-IN' };
    };

    const formatPrice = (price) => {
        const { symbol, rate, locale } = getCurrencyConfig();
        const converted = Number(price) * rate;

        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: symbol === '₹' ? 'INR' : (symbol === '$' ? 'USD' : 'EUR'),
            minimumFractionDigits: symbol === '₹' ? 0 : 2,
            maximumFractionDigits: symbol === '₹' ? 0 : 2
        }).format(converted);
    };

    const updateSettings = async (newSettings) => {
        try {
            const res = await fetch(`${API_URL}/settings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
                body: JSON.stringify(newSettings)
            });
            const data = await res.json();
            if (res.ok) {
                setSettings(data);
                return { success: true };
            }
            return { success: false };
        } catch (error) {
            return { success: false };
        }
    };

    useEffect(() => {
        if (user) {
            localStorage.setItem('store_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('store_user');
            localStorage.removeItem('token');
        }
    }, [user]);

    // Auth methods
    const login = async (email, password, isLoggingInAsAdmin = false) => {
        try {
            const endpoint = isLoggingInAsAdmin ? `${API_URL}/auth/admin/login` : `${API_URL}/auth/login`;
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
                body: JSON.stringify({ email, password })
            });

            const contentType = res.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const data = await res.json();
                if (res.ok) {
                    if (data.requires2FA) return data;
                    setUser(data.user);
                    localStorage.setItem('token', data.token);
                    return { success: true };
                }
                return { success: false, message: data.message || 'Login failed' };
            } else {
                const text = await res.text();
                return { success: false, message: text || 'Server error' };
            }
        } catch (error) {
            console.error("Login fetch error:", error);
            return { success: false, message: "Server connection failed" };
        }
    };

    const verify2FA = async (id, code) => {
        try {
            const res = await fetch(`${API_URL}/auth/admin/verify-2fa`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
                body: JSON.stringify({ id, code })
            });
            const data = await res.json();
            if (res.ok) {
                setUser(data.user);
                localStorage.setItem('token', data.token);
                return { success: true };
            }
            return { success: false, message: data.message };
        } catch {
            return { success: false, message: "Connection error" };
        }
    };

    const register = async (name, email, password) => {
        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
                body: JSON.stringify({ name, email, password })
            });
            const data = await res.json();
            if (res.ok) {
                setUser(data.user);
                localStorage.setItem('token', data.token);
                return { success: true };
            }
            return { success: false, message: data.message };
        } catch {
            return { success: false, message: "Connection error" };
        }
    };

    const logout = () => {
        setUser(null);
    };

    // Product CRUD
    const addProduct = async (product) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify(product)
            });
            const data = await res.json();
            if (res.ok) {
                setProducts(prev => [data, ...prev]);
                return { success: true };
            }
            return { success: false, message: data.message };
        } catch (error) {
            console.error("Error adding product:", error);
            return { success: false, message: "Connection error" };
        }
    };

    const updateProduct = async (id, updatedProduct) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify(updatedProduct)
            });
            const data = await res.json();
            if (res.ok) {
                setProducts(prev => prev.map(p => (p._id === id || p.id === id) ? data : p));
                return { success: true };
            }
            return { success: false, message: data.message };
        } catch (error) {
            console.error("Error updating product:", error);
            return { success: false, message: "Connection error" };
        }
    };

    const deleteProduct = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'ngrok-skip-browser-warning': 'true'
                }
            });
            if (res.ok) {
                setProducts(prev => prev.filter(p => (p._id !== id && p.id !== id)));
                return { success: true };
            }
            return { success: false };
        } catch (error) {
            console.error("Error deleting product:", error);
            return { success: false };
        }
    };

    // Order Methods
    const updateOrderStatus = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/orders/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify({ status })
            });
            const data = await res.json();
            if (res.ok) {
                // Return updated data for optimistic UI or local state sync
                setOrders(prev => prev.map(o => {
                    const orderId = (o._id || o.id)?.toString();
                    return orderId === id.toString() ? data : o;
                }));
                return { success: true, data };
            }
            return { success: false, message: data.message };
        } catch (error) {
            console.error("Error updating order status:", error);
            return { success: false };
        }
    };

    const addOrder = async (order) => {
        try {
            const res = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
                body: JSON.stringify(order)
            });
            const newOrder = await res.json();
            if (res.ok) {
                setOrders(prev => [newOrder, ...prev]);

                // Sync stock levels in local state
                if (order.items && Array.isArray(order.items)) {
                    setProducts(prevProducts => {
                        const updatedProducts = [...prevProducts];
                        order.items.forEach(item => {
                            const productId = item.id || item._id;
                            const productIndex = updatedProducts.findIndex(p => p._id === productId || p.id === productId);
                            if (productIndex !== -1) {
                                const qty = parseInt(item.quantity || 1);
                                updatedProducts[productIndex] = {
                                    ...updatedProducts[productIndex],
                                    stock: (updatedProducts[productIndex].stock || 24) - qty
                                };
                            }
                        });
                        return updatedProducts;
                    });
                }

                return { success: true, order: newOrder };
            }
            return { success: false, message: newOrder.message };
        } catch (error) {
            console.error("Error adding order:", error);
            return { success: false };
        }
    };

    const updateAdminProfile = async (id, profileData) => {
        try {
            const targetId = id || user?.id || user?._id;
            const res = await fetch(`${API_URL}/auth/admin/profile/${targetId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
                body: JSON.stringify(profileData)
            });
            const data = await res.json();
            if (res.ok) {
                setUser(prev => ({ ...prev, ...data }));
                return { success: true };
            }
            return { success: false, message: data.message };
        } catch {
            return { success: false, message: "Connection error" };
        }
    };

    const updateAdminPassword = async (id, passwordData) => {
        try {
            const res = await fetch(`${API_URL}/auth/admin/password/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
                body: JSON.stringify(passwordData)
            });
            const data = await res.json();
            if (res.ok) {
                return { success: true };
            }
            return { success: false, message: data.message };
        } catch {
            return { success: false, message: "Connection error" };
        }
    };

    const fetchSecurityLogs = async () => {
        try {
            const res = await fetch(`${API_URL}/security/logs`, { headers: { 'ngrok-skip-browser-warning': 'true' } });
            const data = await res.json();
            return data;
        } catch {
            return [];
        }
    };

    const resetAdminPasswordRequest = async (email) => {
        try {
            const res = await fetch(`${API_URL}/auth/admin/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            return { success: true, message: data.message, devToken: data.devToken };
        } catch (error) {
            return { success: false, message: 'Server connection failed' };
        }
    };

    const resetAdminPassword = async (token, newPassword) => {
        try {
            const res = await fetch(`${API_URL}/auth/admin/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
                body: JSON.stringify({ token, newPassword })
            });
            const data = await res.json();
            if (res.ok) {
                return { success: true, message: data.message };
            }
            return { success: false, message: data.message };
        } catch (error) {
            return { success: false, message: 'Server connection failed' };
        }
    };

    const updateUserProfile = async (id, profileData) => {
        try {
            const res = await fetch(`${API_URL}/auth/profile/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
                body: JSON.stringify(profileData)
            });
            const data = await res.json();
            if (res.ok) {
                setUser(prev => ({ ...prev, name: data.name, email: data.email }));
                return { success: true };
            }
            return { success: false, message: data.message };
        } catch {
            return { success: false, message: "Connection error" };
        }
    };

    const updateUserPassword = async (id, passwordData) => {
        try {
            const res = await fetch(`${API_URL}/auth/password/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
                body: JSON.stringify(passwordData)
            });
            const data = await res.json();
            if (res.ok) {
                return { success: true };
            }
            return { success: false, message: data.message };
        } catch {
            return { success: false, message: "Connection error" };
        }
    };

    // Coupons
    const [coupons, setCoupons] = useState([]);

    // Fetch coupons on mount
    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const res = await fetch(`${API_URL}/coupons`, { headers: { 'ngrok-skip-browser-warning': 'true' } });
                const data = await res.json();
                if (Array.isArray(data)) setCoupons(data);
            } catch (e) {
                console.error("Error fetching coupons:", e);
            }
        };
        fetchCoupons();
    }, []);

    const addCoupon = async (couponData) => {
        try {
            const res = await fetch(`${API_URL}/coupons`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
                body: JSON.stringify(couponData)
            });
            const data = await res.json();
            if (res.ok) {
                setCoupons(prev => [data, ...prev]);
                return { success: true };
            }
            return { success: false, message: data.message };
        } catch (e) {
            return { success: false, message: 'Server error' };
        }
    };

    const deleteCoupon = async (id) => {
        try {
            const res = await fetch(`${API_URL}/coupons/${id}`, {
                method: 'DELETE',
                headers: { 'ngrok-skip-browser-warning': 'true' }
            });
            if (res.ok) {
                setCoupons(prev => prev.filter(c => c._id !== id));
                return { success: true };
            }
            return { success: false };
        } catch (e) {
            return { success: false };
        }
    };

    const validateCoupon = async (code, cartTotal) => {
        try {
            const res = await fetch(`${API_URL}/coupons/validate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
                body: JSON.stringify({ code, cartTotal })
            });
            const data = await res.json();
            if (res.ok) return { success: true, ...data };
            return { success: false, message: data.message };
        } catch (e) {
            return { success: false, message: 'Server error' };
        }
    };

    const addReview = async (productId, reviewData) => {
        try {
            const res = await fetch(`${API_URL}/products/${productId}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
                body: JSON.stringify(reviewData)
            });
            const data = await res.json();
            if (res.ok) {
                setProducts(prev => prev.map(p => {
                    if (p._id === productId || p.id === productId) {
                        const newReviews = [...(p.reviews || []), { ...reviewData, date: new Date().toISOString() }];
                        const newRating = newReviews.reduce((acc, r) => acc + Number(r.rating), 0) / newReviews.length;
                        return { ...p, reviews: newReviews, numReviews: newReviews.length, rating: newRating };
                    }
                    return p;
                }));
                // Need to reload products to get correct _id for new review if immediate delete, but for now ok
                await fetchProducts(); // Refresh to ensure IDs
                return { success: true };
            }
            return { success: false, message: data.message };
        } catch (e) {
            return { success: false, message: 'Connection error' };
        }
    };

    const deleteReview = async (productId, reviewId) => {
        try {
            const res = await fetch(`${API_URL}/products/${productId}/reviews/${reviewId}`, {
                method: 'DELETE',
                headers: { 'ngrok-skip-browser-warning': 'true' }
            });
            const data = await res.json();
            if (res.ok) {
                setProducts(prev => prev.map(p => {
                    if (p._id === productId || p.id === productId) {
                        const newReviews = p.reviews.filter(r => r._id !== reviewId);
                        const newRating = newReviews.length > 0
                            ? newReviews.reduce((acc, r) => acc + Number(r.rating), 0) / newReviews.length
                            : 0;
                        return { ...p, reviews: newReviews, numReviews: newReviews.length, rating: newRating };
                    }
                    return p;
                }));
                return { success: true };
            }
            return { success: false, message: data.message };
        } catch (e) {
            return { success: false, message: 'Connection error' };
        }
    };

    return (
        <StoreContext.Provider value={{
            products,
            orders,
            customers,
            isAdmin,
            loading,
            user,
            settings,
            formatPrice,
            updateSettings,
            login,
            register,
            logout,
            addProduct,
            updateProduct,
            deleteProduct,
            updateOrderStatus,
            addOrder,
            updateAdminProfile,
            updateAdminPassword,
            verify2FA,
            fetchSecurityLogs,

            updateUserProfile,
            updateUserPassword,

            resetAdminPasswordRequest,
            resetAdminPassword,
            logs,

            // Coupons
            coupons,
            addCoupon,
            deleteCoupon,
            validateCoupon,
            addReview,
            deleteReview
        }}
        >
            {children}
        </StoreContext.Provider>
    );
};
