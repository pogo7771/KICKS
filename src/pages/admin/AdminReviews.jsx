import React, { useState } from 'react';
import {
    MessageSquare,
    Search,
    Trash2,
    Star,
    Filter,
    ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { useNotification } from '../../context/NotificationContext';
import '../../css/admin/AdminProducts.css'; // Reusing admin styles

const AdminReviews = () => {
    const { products, deleteReview } = useStore();
    const { showNotification } = useNotification();
    const [searchTerm, setSearchTerm] = useState('');
    const [ratingFilter, setRatingFilter] = useState('all');

    // Flatten reviews from all products
    const allReviews = products.flatMap(product =>
        (product.reviews || []).map(review => ({
            ...review,
            productId: product._id || product.id,
            productName: product.name,
            productImage: product.images?.primary
        }))
    ).sort((a, b) => new Date(b.date) - new Date(a.date));

    const filteredReviews = allReviews.filter(review => {
        const matchesSearch =
            review.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
            review.productName.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRating = ratingFilter === 'all' || Math.round(review.rating) === parseInt(ratingFilter);

        return matchesSearch && matchesRating;
    });

    const handleDelete = async (productId, reviewId) => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            const res = await deleteReview(productId, reviewId);
            if (res.success) {
                showNotification('Review removed successfully', 'info');
            } else {
                showNotification(res.message || 'Failed to remove review', 'error');
            }
        }
    };

    return (
        <div className="admin-products-container">
            <div className="page-header">
                <div>
                    <h1>Customer Reviews</h1>
                    <p>Monitor and manage product feedback</p>
                </div>
                <div className="bg-white px-3 py-2 rounded-pill shadow-sm d-flex align-items-center gap-2">
                    <Star size={18} className="text-warning fill-warning" />
                    <span className="fw-bold">{allReviews.length}</span>
                    <span className="text-secondary small">Total Reviews</span>
                </div>
            </div>

            <div className="content-card">
                <div className="table-actions">
                    <div className="search-box">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search by user, comment or product..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <Filter size={18} className="text-secondary" />
                        <select
                            className="form-select border-0 bg-light rounded-pill fw-bold small py-2 px-3 focus-none cursor-pointer"
                            value={ratingFilter}
                            onChange={(e) => setRatingFilter(e.target.value)}
                            style={{ width: '150px' }}
                        >
                            <option value="all">All Ratings</option>
                            <option value="5">5 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="2">2 Stars</option>
                            <option value="1">1 Star</option>
                        </select>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Reviewer</th>
                                <th>Rating</th>
                                <th>Comment</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReviews.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-5">
                                        <div className="d-flex flex-column align-items-center opacity-50">
                                            <MessageSquare size={48} className="mb-3" />
                                            <h5>No reviews found</h5>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredReviews.map((review) => (
                                    <tr key={review._id || `${review.productId}-${review.date}`}>
                                        <td>
                                            <div className="d-flex align-items-center gap-3">
                                                <img
                                                    src={review.productImage}
                                                    alt={review.productName}
                                                    className="rounded shadow-sm"
                                                    style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                                />
                                                <div className="d-flex flex-column">
                                                    <span className="fw-bold small">{review.productName}</span>
                                                    <Link
                                                        to={`/product/${review.productId}`}
                                                        target="_blank"
                                                        className="text-primary smaller text-decoration-none d-flex align-items-center gap-1"
                                                    >
                                                        View Product <ExternalLink size={10} />
                                                    </Link>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="bg-light rounded-circle d-flex align-items-center justify-content-center fw-bold small text-secondary" style={{ width: '32px', height: '32px' }}>
                                                    {review.user.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="fw-medium">{review.user}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={14}
                                                        className={i < review.rating ? 'fill-warning text-warning' : 'text-secondary opacity-25'}
                                                    />
                                                ))}
                                            </div>
                                        </td>
                                        <td>
                                            <p className="mb-0 text-secondary small truncate" style={{ maxWidth: '300px' }} title={review.comment}>
                                                {review.comment}
                                            </p>
                                        </td>
                                        <td className="text-secondary small">
                                            {new Date(review.date).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <button
                                                className="action-btn delete"
                                                onClick={() => handleDelete(review.productId, review._id)}
                                                title="Delete Review"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminReviews;
