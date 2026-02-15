import React, { useEffect, useRef, useState } from 'react';
import '../css/CustomCursor.css';

const CustomCursor = () => {
    const dotRef = useRef(null);
    const circleRef = useRef(null);
    const requestRef = useRef(null);

    // Mouse position
    const mouseX = useRef(0);
    const mouseY = useRef(0);

    // Smooth circle position
    const circleX = useRef(0);
    const circleY = useRef(0);

    const [hovered, setHovered] = useState(false);
    const [clicked, setClicked] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseX.current = e.clientX;
            mouseY.current = e.clientY;

            if (!isVisible) setIsVisible(true);

            // Move dot instantly
            if (dotRef.current) {
                dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
            }
        };

        const handleMouseDown = () => setClicked(true);
        const handleMouseUp = () => setClicked(false);

        const handleMouseOver = (e) => {
            if (['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) ||
                e.target.closest('a') || e.target.closest('button') ||
                e.target.classList.contains('cursor-pointer') ||
                e.target.closest('.cursor-pointer') ||
                e.target.closest('.category-card')
            ) {
                setHovered(true);
            } else {
                setHovered(false);
            }
        };

        const handleMouseOut = (e) => { // Reset hover if leaving window, optional logic
            // document level mouseout is tricky, let's ignore for now.
            // But we do want to hide cursor if user leaves window?
        };

        const animateCircle = () => {
            // Lerp factor (0.15 = speed)
            circleX.current += (mouseX.current - circleX.current) * 0.15;
            circleY.current += (mouseY.current - circleY.current) * 0.15;

            if (circleRef.current) {
                circleRef.current.style.transform = `translate3d(${circleX.current}px, ${circleY.current}px, 0) translate(-50%, -50%)`;
            }

            requestRef.current = requestAnimationFrame(animateCircle);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mouseover', handleMouseOver);

        requestRef.current = requestAnimationFrame(animateCircle);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mouseover', handleMouseOver);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [isVisible]);

    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 991px)').matches) {
        return null; // Don't render on mobile
    }

    return (
        <>
            <div ref={dotRef} className={`custom-cursor-dot ${isVisible ? 'visible' : ''}`}></div>
            <div ref={circleRef} className={`custom-cursor-circle ${hovered ? 'hovered' : ''} ${clicked ? 'clicked' : ''} ${isVisible ? 'visible' : ''}`}></div>
        </>
    );
};

export default CustomCursor;
