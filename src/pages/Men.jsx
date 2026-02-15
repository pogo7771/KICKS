import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { useStore } from '../context/StoreContext';

const Men = () => {
    const { products: shoes } = useStore();
    const menShoes = (shoes || []).filter(shoe => shoe.gender === 'Men' || shoe.gender === 'Unisex');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const categories = ['All', 'Running', 'Casual', 'Classic', 'Lifestyle', 'Basketball'];

    const filtered = categoryFilter === 'All'
        ? menShoes
        : menShoes.filter(s => s.category === categoryFilter);

    return (
        <div className="container py-5">
            <div className="text-center mb-5">
                <span className="text-uppercase text-primary fw-bold small">Built for Performance</span>
                <h1 className="display-4 fw-bold mt-2">Men's Collection</h1>
                <p className="lead text-secondary mt-3">Discover the latest in men's footwear, designed for speed and style.</p>
            </div>

            <div className="d-flex justify-content-center flex-wrap gap-2 mb-5">
                {categories.map(cat => (
                    <button
                        key={cat}
                        className={`btn rounded-pill px-4 ${categoryFilter === cat ? 'btn-dark' : 'btn-outline-secondary border-0'}`}
                        onClick={() => setCategoryFilter(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 animate-fade-in">
                {filtered.map(shoe => (
                    <div className="col" key={shoe.id || shoe._id}>
                        <ProductCard product={shoe} />
                    </div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-5">
                    <div className="mb-3 text-secondary opacity-25" style={{ fontSize: '4rem' }}>👟</div>
                    <h3 className="fw-bold">No products found</h3>
                    <p className="text-muted">We couldn't find any men's shoes in this category.</p>
                </div>
            )}
        </div>
    );
};

export default Men;
