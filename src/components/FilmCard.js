import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/components.css';

const FilmCard = ({ film }) => {
    const navigate = useNavigate();
    const [flipped, setFlipped] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const cardRef = useRef(null);

    // Handle only card flip
    const handleCardClick = () => {
        setFlipped(!flipped);
    };

    // Separate handler for download button
    const handleDownloadClick = (e) => {
        e.stopPropagation(); // Prevent card flip
        navigate(`/movies/${encodeURIComponent(film.title)}`, {
            state: { originalTitle: film.title, year: film.year }
        });
    };

    useEffect(() => {
        let isMounted = true; // Add mounted flag
        const observer = new IntersectionObserver(
            ([entry]) => {
                // Only update state if component is still mounted
                if (isMounted) {
                    setIsVisible(entry.isIntersecting);
                }
            },
            { threshold: 0.1 }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        // Cleanup function
        return () => {
            isMounted = false; // Set flag to false on cleanup
            observer.disconnect(); // Disconnect observer completely
            if (cardRef.current) {
                observer.unobserve(cardRef.current);
            }
        };
    }, []);

    return (
        <div 
            ref={cardRef}
            className={`movie-card${flipped ? ' flipped' : ''} ld-fade${isVisible ? ' show' : ''}`} 
            onClick={handleCardClick}
        >
            <div className={`card-inner${flipped ? ' flipped' : ''}`}>
                <div className="card-front">
                    <img src={film.banner} alt={film.title} className="movie-poster" />
                    <div className="movie-title-overlay">
                        <h3 className="movie-title">{film.title}</h3>
                        <div className="movie-info">
                            <span className="movie-year">{film.year}</span>
                            <span className="movie-rating">
                                <span className="stars">⭐</span>
                                {film.imdbRating}
                            </span>
                        </div>
                    </div>
                </div> 
                <div className="card-back">
                    <h2>{film.title}</h2>
                    <div className="genre-tags">
                        {film.genres?.map((genre, index) => (
                            <span key={index} className="genre-tag">{genre}</span>
                        ))}
                    </div>
                    <div className="synopsis">
                        {film.synopsis}
                    </div>
                    <button 
                        className="view-details-btn"
                        onClick={handleDownloadClick}
                    >
                        Download
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilmCard;