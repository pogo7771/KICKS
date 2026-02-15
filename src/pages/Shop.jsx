import React, { useState, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import { useStore } from '../context/StoreContext';
import { Filter, ChevronDown, LayoutGrid, List } from 'lucide-react';
import '../css/Shop.css';

const Shop = () => {
    const { products: shoes } = useStore();
    const [filter, setFilter] = useState('All');
    const [sortBy, setSortBy] = useState('default');
    const [isFiltering, setIsFiltering] = useState(false);

    const categories = ['All', 'Running', 'Casual', 'Basketball', 'Lifestyle'];

    const handleFilterChange = (cat) => {
        setIsFiltering(true);
        setFilter(cat);
        setTimeout(() => setIsFiltering(false), 500);
    };

    const filteredAndSortedShoes = useMemo(() => {
        let result = filter === 'All'
            ? [...(shoes || [])]
            : (shoes || []).filter(shoe => shoe.category === filter);

        if (sortBy === 'price-low') {
            result.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-high') {
            result.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'newest') {
            result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        return result;
    }, [shoes, filter, sortBy]);

    return (
        <div className="container py-5">
            <header className="mb-5 pb-4 border-bottom">
                <div className="row align-items-end g-4">
                    <div className="col-lg-6">
                        <h1 className="display-4 fw-black mb-2">Our Collection</h1>
                        <p className="lead text-secondary mb-0">Discover the fusion of performance and street style.</p>
                    </div>
                    <div className="col-lg-6 d-flex flex-wrap justify-content-lg-end gap-3">
                        <div className="d-flex align-items-center bg-white rounded-pill px-3 py-2 border shadow-sm">
                            <Filter size={18} className="text-primary me-2" />
                            <select
                                className="form-select border-0 bg-transparent fw-bold small p-0 focus-none"
                                value={filter}
                                onChange={(e) => handleFilterChange(e.target.value)}
                                style={{ width: 'auto', outline: 'none', boxShadow: 'none' }}
                            >
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div className="d-flex align-items-center bg-white rounded-pill px-3 py-2 border shadow-sm">
                            <ChevronDown size={18} className="text-secondary me-2" />
                            <select
                                className="form-select border-0 bg-transparent fw-bold small p-0 focus-none"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                style={{ width: 'auto', outline: 'none', boxShadow: 'none' }}
                            >
                                <option value="default">Sort By: Popularity</option>
                                <option value="newest">Sort By: Newest</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                </div>
            </header>

            <div className="position-relative">
                {isFiltering && (
                    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-start pt-5 bg-white bg-opacity-75 z-index-1" style={{ zIndex: 10 }}>
                        <div className="spinner-border text-primary" role="status"></div>
                    </div>
                )}

                <div className={`row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 transition-all duration-500 ${isFiltering ? 'opacity-0 transform-scale-95' : 'opacity-100'}`}>
                    {filteredAndSortedShoes.map(shoe => (
                        <div className="col animate-fade-in" key={shoe.id || shoe._id}>
                            <ProductCard product={shoe} />
                        </div>
                    ))}
                </div>
            </div>

            {filteredAndSortedShoes.length === 0 && (
                <div className="text-center py-5 my-5">
                    <div className="display-1 text-light opacity-25 mb-4">:(</div>
                    <h2 className="fw-black">No Matches Found</h2>
                    <p className="text-secondary lead">Try adjusting your filters to find what you're looking for.</p>
                </div>
            )}
        </div>
    );
};

export default Shop;
