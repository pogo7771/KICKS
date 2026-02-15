import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import '../css/CategoryShowcase.css';

const CategoryShowcase = () => {
    const categories = [
        {
            id: 'men',
            name: "Men's Collection",
            count: "120+ Products",
            image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop",
            link: "/shop"
        },
        {
            id: 'women',
            name: "Women's Collection",
            count: "80+ Products",
            image: "https://images.unsplash.com/photo-1529810313688-44ea1c2d81d3?q=80&w=1000&auto=format&fit=crop",
            link: "/women"
        },
        {
            id: 'running',
            name: "Performance Gear",
            count: "45+ Products",
            image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=1000&auto=format&fit=crop",
            link: "/shop"
        }
    ];

    return (
        <section className="category-showcase py-5">
            <div className="container">
                <div className="text-center mb-5 reveal">
                    <span className="text-primary fw-bold text-uppercase small tracking-widest">Find Your Style</span>
                    <h2 className="display-4 fw-black mt-2">Shop by Category</h2>
                </div>

                <div className="row g-4 reveal">
                    {/* Left Column - Large Feature Card */}
                    <div className="col-lg-6">
                        <Link to={categories[0].link} className="category-card large-card d-block position-relative overflow-hidden w-100">
                            <img src={categories[0].image} alt={categories[0].name} className="img-fluid w-100 h-100 object-fit-cover" />
                            <div className="category-content">
                                <span className="badge-custom">{categories[0].count}</span>
                                <h3 className="category-title display-5">{categories[0].name}</h3>
                                <div className="explore-link mt-3">
                                    Explore Collection <ArrowRight size={18} />
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Right Column - Stacked Small Cards */}
                    <div className="col-lg-6 d-flex flex-column gap-4">
                        {categories.slice(1).map((cat) => (
                            <Link to={cat.link} key={cat.id} className="category-card small-card d-block position-relative overflow-hidden w-100">
                                <img src={cat.image} alt={cat.name} className="img-fluid w-100 h-100 object-fit-cover" />
                                <div className="category-content p-4">
                                    <span className="badge-custom">{cat.count}</span>
                                    <h3 className="category-title">{cat.name}</h3>
                                    <div className="explore-link mt-2">
                                        Shop Now <ArrowRight size={16} />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CategoryShowcase;
