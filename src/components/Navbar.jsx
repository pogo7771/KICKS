import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search, Heart, User, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useStore } from '../context/StoreContext';
import SearchOverlay from './SearchOverlay';
import SidebarCart from './SidebarCart';
import '../css/Navbar.css';

const Navbar = () => {
    const { user, logout } = useStore();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { cartCount = 0 } = useCart();
    const { wishlist = [] } = useWishlist();

    const [scrolled, setScrolled] = useState(false);
    const isHome = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change logic - during render
    const [prevPath, setPrevPath] = useState(location.pathname);
    if (location.pathname !== prevPath) {
        setIsOpen(false);
        setPrevPath(location.pathname);
    }



    return (
        <>
            <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            <SidebarCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            <nav className={`navbar navbar-expand-lg fixed-top ${scrolled || !isHome ? 'navbar-scrolled' : 'navbar-initial'}`}>
                <div className="container">
                    <Link to="/" className="navbar-brand fw-black fs-2 reveal-nav-item" style={{ transitionDelay: '0.1s' }}>
                        KICKS<span className="text-primary">.</span>
                    </Link>

                    <div className="d-flex align-items-center order-lg-3 gap-2 gap-md-3">
                        <button
                            className="btn btn-link nav-icon p-0 reveal-nav-item"
                            style={{ transitionDelay: '0.2s' }}
                            onClick={() => setIsSearchOpen(true)}
                        >
                            <Search size={22} />
                        </button>
                        <Link
                            to="/wishlist"
                            className="nav-icon reveal-nav-item"
                            style={{ transitionDelay: '0.3s' }}
                        >
                            <div className="position-relative">
                                <Heart size={22} />
                                {wishlist.length > 0 && <span className="cat-badge">{wishlist.length}</span>}
                            </div>
                        </Link>

                        <button
                            className="btn btn-link nav-icon p-0 reveal-nav-item"
                            style={{ transitionDelay: '0.4s' }}
                            onClick={() => setIsCartOpen(true)}
                        >
                            <div className="position-relative">
                                <ShoppingBag size={22} />
                                {cartCount > 0 && <span className="cat-badge bg-primary">{cartCount}</span>}
                            </div>
                        </button>

                        <div className="reveal-nav-item" style={{ transitionDelay: '0.5s' }}>
                            {user ? (
                                <div className="dropdown">
                                    <button className="nav-icon dropdown-toggle no-caret p-0 border-0 bg-transparent d-flex align-items-center" data-bs-toggle="dropdown">
                                        {user.avatar ? (
                                            <img
                                                src={user.avatar}
                                                alt={user.name}
                                                className="rounded-circle border border-2 border-primary border-opacity-10 shadow-sm"
                                                style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <div
                                                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-black smaller"
                                                style={{ width: '32px', height: '32px', fontSize: '10px' }}
                                            >
                                                {user.name?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-end shadow-premium border-0 mt-3 animate-slide-in">
                                        <li className="px-4 py-3 border-bottom">
                                            <div className="fw-black smaller text-uppercase letter-spacing-1">{user.name}</div>
                                            <div className="text-secondary smaller">{user.email}</div>
                                        </li>
                                        {user.isAdmin && <li><Link className="dropdown-item py-2" to="/admin" target="_blank" rel="noopener noreferrer">Admin Hub</Link></li>}
                                        <li><Link className="dropdown-item py-2" to="/orders">Order History</Link></li>
                                        <li><hr className="dropdown-divider opacity-5" /></li>
                                        <li><button className="dropdown-item py-2 text-danger" onClick={logout}>Sign Out</button></li>
                                    </ul>
                                </div>
                            ) : (
                                <Link to="/login" className="nav-icon"><User size={22} /></Link>
                            )}
                        </div>

                        <button className="navbar-toggler border-0 p-0 ms-2 d-lg-none" onClick={() => setIsOpen(!isOpen)}>
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''} justify-content-center`}>
                        <ul className="navbar-nav gap-2 gap-lg-4 align-items-center mt-3 mt-lg-0">
                            {[
                                { name: 'Home', path: '/' },
                                { name: 'New Arrivals', path: '/shop' },
                                { name: 'Men', path: '/men' },
                                { name: 'Women', path: '/women' }
                            ].map((item, idx) => (
                                <li className="nav-item reveal-nav-item" key={item.path} style={{ transitionDelay: `${0.6 + (idx * 0.1)}s` }}>
                                    <NavLink to={item.path} className={`nav-link ${item.class || ''}`} onClick={() => setIsOpen(false)}>
                                        {item.name}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
