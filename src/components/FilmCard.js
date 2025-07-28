import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/components.css';

const FilmCard = ({ film }) => {
    const navigate = useNavigate();
    const [flipped, setFlipped] = useState(false);
    const timerRef = useRef(null);
    const clickCountRef = useRef(0);

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

    return (
        <div className={`movie-card${flipped ? ' flipped' : ''}`} onClick={handleCardClick}>
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
                    <div style={{ textAlign: 'center', marginTop: '20px', color: '#fff' }}>
                        Click again to view details
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilmCard;