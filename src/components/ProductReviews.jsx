
import React, { useState } from 'react';
import { Star, User, MessageSquare } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useNotification } from '../context/NotificationContext';

const ProductReviews = ({ product }) => {
    const { addReview, user } = useStore();
    const { showNotification } = useNotification();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            showNotification('Please login to write a review', 'error');
            return;
        }

        setIsSubmitting(true);
        const res = await addReview(product._id || product.id, {
            rating: Number(rating),
            comment,
            user: user.name
        });

        if (res.success) {
            showNotification('Review added successfully!', 'success');
            setComment('');
            setRating(5);
            setShowForm(false);
        } else {
            showNotification(res.message || 'Failed to add review', 'error');
        }
        setIsSubmitting(false);
    };

    const reviews = product.reviews || [];

    return (
        <div className="product-reviews mt-5">
            <div className="d-flex align-items-center justify-content-between mb-4">
                <h3 className="fw-black m-0">Customer Reviews ({reviews.length})</h3>
                <button
                    className="btn btn-outline-dark rounded-pill fw-bold"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Cancel' : 'Write a Review'}
                </button>
            </div>

            {showForm && (
                <div className="card border-0 bg-light rounded-4 p-4 mb-5 animate-slide-down">
                    <h5 className="fw-bold mb-3">Write your review</h5>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label small fw-bold text-secondary">RATING</label>
                            <div className="d-flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        size={24}
                                        className={`cursor-pointer transition-transform hover-scale ${star <= rating ? 'fill-warning text-warning' : 'text-secondary opacity-25'}`}
                                        onClick={() => setRating(star)}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label small fw-bold text-secondary">YOUR REVIEW</label>
                            <textarea
                                className="form-control border-0 shadow-sm rounded-4 p-3"
                                rows="4"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Tell us what you think about this product..."
                                required
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="btn btn-dark rounded-pill px-4 fw-bold"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Post Review'}
                        </button>
                    </form>
                </div>
            )}

            <div className="reviews-list d-flex flex-column gap-4">
                {reviews.length === 0 ? (
                    <div className="text-center py-5 bg-light rounded-4">
                        <MessageSquare size={48} className="text-secondary opacity-25 mb-3" />
                        <p className="text-secondary fw-medium">No reviews yet. Be the first to review!</p>
                    </div>
                ) : (
                    reviews.slice().reverse().map((review, idx) => (
                        <div key={idx} className="review-item border-bottom pb-4">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '40px', height: '40px' }}>
                                        {review.user ? review.user.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <div>
                                        <h6 className="fw-bold mb-0">{review.user}</h6>
                                        <div className="d-flex gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={12} className={i < review.rating ? 'fill-warning text-warning' : 'text-secondary opacity-25'} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-secondary smaller">
                                    {new Date(review.date).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-secondary mb-0 ps-5 ms-2">{review.comment}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ProductReviews;
