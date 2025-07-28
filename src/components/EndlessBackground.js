import React, { useEffect, useRef } from 'react';

const EndlessBackground = () => {
    const floatingRef = useRef(null);

    useEffect(() => {
        const createSquare = () => {
            if (!floatingRef.current) return;
            
            const square = document.createElement('div');
            square.className = 'square-float';
            
            // Random size between 20px and 50px
            const size = Math.random() * 30 + 20;
            square.style.width = `${size}px`;
            square.style.height = `${size}px`;
            
            // Random position
            square.style.left = `${Math.random() * 100}%`;
            
            floatingRef.current.appendChild(square);
            
            // Remove square after animation completes
            setTimeout(() => {
                if (square && square.parentNode) {
                    square.remove();
                }
            }, 20000);
        };

        const interval = setInterval(createSquare, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="endless-squares-bg">
            <div className="grid-pattern"></div>
            <div className="diagonal-grid"></div>
            <div ref={floatingRef} className="floating-elements"></div>
        </div>
    );
};

export default EndlessBackground;