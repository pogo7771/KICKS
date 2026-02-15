import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { X, Search as SearchIcon, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import '../css/SearchOverlay.css';

const SearchOverlay = ({ isOpen, onClose }) => {
    const { products: shoes, formatPrice } = useStore();
    const [query, setQuery] = useState('');
    const inputRef = useRef(null);
    const navigate = useNavigate();

    const handleSearch = (e) => {
        if (e.key === 'Enter' && query.trim()) {
            onClose();
            navigate(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
            // Prevent scrolling of body when overlay is open
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);

        return () => {
            document.body.style.overflow = 'auto';
            window.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onClose]);

    const results = React.useMemo(() => {
        if (query.trim().length > 1) {
            const filtered = (shoes || []).filter(shoe =>
            (shoe.name?.toLowerCase().includes(query.toLowerCase()) ||
                shoe.brand?.toLowerCase().includes(query.toLowerCase()) ||
                shoe.category?.toLowerCase().includes(query.toLowerCase()))
            );
            return filtered.slice(0, 8); // Limit to 8 results
        }
        return [];
    }, [query, shoes]);

    if (!isOpen) return null;

    return (
        <div className="search-overlay">
            <button className="close-search" onClick={onClose} aria-label="Close search">
                <X size={32} />
            </button>

            <div className="search-input-container">
                <input
                    ref={inputRef}
                    type="text"
                    className="search-input"
                    placeholder="Search for shoes, brands..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleSearch}
                />
            </div>

            <div className="search-results">
                {results.length > 0 ? (
                    <div className="results-list">
                        <h6 className="text-secondary text-uppercase small fw-bold mb-3 ms-2">Products</h6>
                        {results.map(shoe => (
                            <Link
                                key={shoe.id || shoe._id}
                                to={`/product/${shoe.id || shoe._id}`}
                                className="search-result-item"
                                onClick={onClose}
                            >
                                <img src={shoe.images?.primary} alt={shoe.name} className="search-result-image" />
                                <div>
                                    <div className="fw-bold text-dark">{shoe.name}</div>
                                    <div className="small text-secondary">{shoe.brand} • {shoe.category}</div>
                                </div>
                                <div className="ms-auto fw-bold">{formatPrice(shoe.price || 0)}</div>
                            </Link>
                        ))}
                        {results.length >= 8 && (
                            <Link
                                to={`/search?q=${encodeURIComponent(query)}`}
                                className="btn btn-link text-primary fw-bold mt-3 text-decoration-none d-flex align-items-center justify-content-center gap-2"
                                onClick={onClose}
                            >
                                View All Results <ArrowRight size={18} />
                            </Link>
                        )}
                    </div>
                ) : query.trim().length > 1 ? (
                    <div className="text-center py-5">
                        <p className="lead text-secondary">No results found for "{query}"</p>
                    </div>
                ) : (
                    <div className="popular-searches text-center py-5">
                        <p className="text-secondary">Try searching for "Nike", "Running", or "Casual"</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchOverlay;
