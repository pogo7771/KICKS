import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const PaymentForm = ({ onPaymentSuccess, isLoading: parentLoading }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Return URL where the user is redirected after payment
                return_url: window.location.origin + "/orders",
            },
            redirect: "if_required",
        });

        if (error) {
            // Show error to your customer (e.g., payment details incomplete)
            setMessage(error.message);
            setIsProcessing(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            // Success!
            onPaymentSuccess(paymentIntent);
        } else {
            setMessage("Unexpected state.");
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4">
            <PaymentElement id="payment-element" />
            <button
                disabled={isProcessing || !stripe || !elements || parentLoading}
                className="w-100 btn btn-primary btn-lg mt-4 d-flex align-items-center justify-content-center gap-2"
                id="submit"
            >
                {(isProcessing || parentLoading) ? (
                    <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Processing...
                    </>
                ) : (
                    "Pay Now"
                )}
            </button>
            {message && <div id="payment-message" className="alert alert-danger mt-3 small">{message}</div>}
        </form>
    );
};

export default PaymentForm;
