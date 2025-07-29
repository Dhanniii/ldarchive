import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/components.css';

const FilmCard = ({ film }) => {
    const navigate = useNavigate();
    const [flipped, setFlipped] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const timerRef = useRef(null);
    const clickCountRef = useRef(0);
    const cardRef = useRef(null);

    const handleCardClick = () => {
        clickCountRef.current += 1;
        
        if (clickCountRef.current === 1) {
            setFlipped(true);
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
                setFlipped(false);
                clickCountRef.current = 0;
            }, 5000);
        } else if (clickCountRef.current === 2) {
            navigate(`/movies/${film.title}`, { state: { originalTitle: film.title, year: film.year } });
            clickCountRef.current = 0;
        }
    };

    // Modified validation - check for required fields
    if (!film || !film.title || !film.banner) {
        console.error('Film card received invalid film data:', film);
        return null;
    }

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    const handleViewDetail = (film) => {
        navigate(`/movies/${encodeURIComponent(film.title)}`);
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // Set isVisible based on current intersection state
                setIsVisible(entry.isIntersecting);
            },
            {
                threshold: 0.1,
                rootMargin: '50px' // Trigger slightly before element comes into view
            }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => {
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
                    <button className="view-details-btn">
                        Download
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilmCard;
