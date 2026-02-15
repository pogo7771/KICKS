import React from 'react';
import '../css/BrandMarquee.css';

const BrandMarquee = () => {
    const brands = ["NIKE", "ADIDAS", "PUMA", "REEBOK", "CONVERSE", "VANS", "NEW BALANCE", "ASICS", "JORDAN", "SALOMON"];

    return (
        <div className="brand-marquee-container py-5 bg-dark">
            <div className="marquee-content">
                {/* Double the list for seamless loop */}
                {[...brands, ...brands].map((brand, index) => (
                    <div key={index} className="brand-item">
                        {brand}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BrandMarquee;
