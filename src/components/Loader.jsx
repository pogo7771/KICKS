import React from 'react';
import '../css/Loader.css';

const Loader = ({ fullPage = false }) => {
    return (
        <div className={`loader-container ${fullPage ? 'full-page' : ''}`}>
            <div className="loader-content">
                <h1 className="loader-brand" data-text="KICKS.">KICKS.</h1>
                <div className="loader-progress-track">
                    <div className="loader-progress-bar"></div>
                </div>
            </div>
        </div>
    );
};

export default Loader;
