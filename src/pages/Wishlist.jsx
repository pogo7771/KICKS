import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import { ShoppingBag, ArrowRight, HeartOff } from 'lucide-react';
import { Link } from 'react-router-dom';

const Wishlist = () => {
    const { wishlist } = useWishlist();

    return (
        <div className="container py-5 min-vh-100">
            <header className="text-center mb-5">
                <h1 className="display-4 fw-bold">My Wishlist</h1>
                <p className="lead text-secondary">Your favorite pieces, all in one place.</p>
            </header>

            {(!wishlist || wishlist.length === 0) ? (
                <div className="text-center py-5">
                    <div className="mb-4 text-secondary opacity-25">
                        <HeartOff size={80} />
                    </div>
                    <h2 className="h4 fw-bold">Your wishlist is empty</h2>
                    <p className="text-secondary mb-4">Start adding items you love to your wishlist!</p>
                    <Link to="/shop" className="btn btn-dark btn-lg px-5 rounded-pill d-inline-flex align-items-center gap-2">
                        Browse Collection <ArrowRight size={20} />
                    </Link>
                </div>
            ) : (
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                    {wishlist.map(product => (
                        <div className="col" key={product.id || product._id}>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
