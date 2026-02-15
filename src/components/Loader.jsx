import React from 'react';
import '../css/Loader.css';

const Loader = ({ fullPage = false }) => {
    return (
        <div className={`loader-container ${fullPage ? 'full-page' : ''}`}>
            <div className="premium-loader">
                <div className="loader-ring"></div>
                <div className="loader-ring"></div>
                <div className="loader-ring"></div>
                <div className="loader-text">STORE</div>
            </div>
        </div>
    );
};

export default Loader;
