import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';
import { Search as SearchIcon, ArrowRight } from 'lucide-react';

const SearchResults = () => {
    const { products } = useStore();
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('q') || '';

    const filteredProducts = (products || []).filter(product =>
        product.name?.toLowerCase().includes(query.toLowerCase()) ||
        product.brand?.toLowerCase().includes(query.toLowerCase()) ||
        product.category?.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="container py-5 min-vh-100">
            <div className="mb-5">
                <div className="d-flex align-items-center gap-3 mb-2">
                    <SearchIcon size={24} className="text-primary" />
                    <span className="text-secondary fw-bold text-uppercase small tracking-wider">Search Results</span>
                </div>
                <h1 className="display-4 fw-black">
                    Results for "{query}"
                    <span className="text-primary fs-3 ms-3">({filteredProducts.length})</span>
                </h1>
            </div>

            {filteredProducts.length > 0 ? (
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                    {filteredProducts.map(product => (
                        <div className="col" key={product.id || product._id}>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-5 bg-light rounded-5">
                    <div className="mb-4 opacity-25">
                        <SearchIcon size={80} />
                    </div>
                    <h2 className="fw-black mb-3">No matches found</h2>
                    <p className="text-secondary lead mb-4">We couldn't find any products matching "{query}". Try checking your spelling or using more general terms.</p>
                    <Link to="/shop" className="btn btn-primary btn-lg px-5 rounded-pill d-inline-flex align-items-center gap-2">
                        Continue Shopping <ArrowRight size={20} />
                    </Link>
                </div>
            )}
        </div>
    );
};

export default SearchResults;
