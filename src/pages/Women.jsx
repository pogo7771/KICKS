import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { useStore } from '../context/StoreContext';

const Women = () => {
    const { products: shoes } = useStore();
    const womenShoes = (shoes || []).filter(shoe => shoe.gender === 'Women' || shoe.gender === 'Unisex');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const categories = ['All', 'Running', 'Casual', 'Classic', 'Lifestyle'];

    const filtered = categoryFilter === 'All'
        ? womenShoes
        : womenShoes.filter(s => s.category === categoryFilter);

    return (
        <div className="container py-5">
            <div className="text-center mb-5">
                <span className="text-uppercase text-danger fw-bold small">Just for Her</span>
                <h1 className="display-4 fw-bold mt-2">Women's Collection</h1>
            </div>

            <div className="d-flex justify-content-center mb-5">
                {categories.map(cat => (
                    <button
                        key={cat}
                        className={`btn rounded-pill px-4 mx-1 ${categoryFilter === cat ? 'btn-dark' : 'btn-outline-secondary border-0'}`}
                        onClick={() => setCategoryFilter(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4">
                {filtered.map(shoe => (
                    <div className="col" key={shoe.id || shoe._id}>
                        <ProductCard product={shoe} />
                    </div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-5">
                    <p className="text-muted">No products found in this category.</p>
                </div>
            )}
        </div>
    );
};

export default Women;
