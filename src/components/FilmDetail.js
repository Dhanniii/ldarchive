import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import EndlessBackground from './EndlessBackground';
import SnowEffect from './SnowEffect';

const DownloadIcon = () => (
    <svg viewBox="0 0 24 24" className="download-icon">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7,10 12,15 17,10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
);

const BackIcon = () => (
    <svg viewBox="0 0 24 24" className="back-icon">
        <polyline points="15,18 9,12 15,6"></polyline>
    </svg>
);

const LoadingSpinner = () => (
    <div className="spinner"></div>
);

const SkeletonLoader = () => (
    <div className="skeleton-loader">
        <div className="skeleton-grid">
            <div className="skeleton-poster"></div>
            <div className="skeleton-content">
                <div className="skeleton-title"></div>
                <div className="skeleton-meta"></div>
                <div className="skeleton-rating"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-text"></div>
            </div>
        </div>
    </div>
);

const FilmDetail = () => {
    const { title } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const originalTitle = location.state?.originalTitle || title;
    const year = location.state?.year;
    const [film, setFilm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [downloadLinks, setDownloadLinks] = useState([]);
    const [downloadLoading, setDownloadLoading] = useState(false);

    useEffect(() => {
        const fetchFilm = async () => {
            try {
                const apiKey = process.env.REACT_APP_OMDB_API_KEY;
                // Change http to https
                let url = `https://www.omdbapi.com/?t=${encodeURIComponent(originalTitle)}&apikey=${apiKey}`;
                if (year) url += `&y=${year}`; // Selalu tambahkan tahun jika ada
                const response = await fetch(url);
                const data = await response.json();
                if (data.Response === "False") {
                    throw new Error(data.Error || 'Film not found');
                }
                setFilm(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchFilm();
    }, [originalTitle, year]);

    // Fetch download links from your API
    useEffect(() => {
        const fetchDownloadLinks = async () => {
            setDownloadLoading(true);
            try {
                if (!process.env.REACT_APP_API_URL || !process.env.REACT_APP_API_KEY) {
                    throw new Error('API configuration is missing');
                }

                const url = `${process.env.REACT_APP_API_URL}/by-title?title=${encodeURIComponent(film.Title)}${film.Year ? `&year=${film.Year}` : ''}`;
                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${process.env.REACT_APP_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                });
                const found = await response.json();

                // Mapping downloadOptions ke array tombol
                let links = [];
                if (found?.downloadOptions) {
                    Object.entries(found.downloadOptions).forEach(([quality, urls]) => {
                        urls.forEach((url, idx) => {
                            links.push({
                                label: `${quality} GDrive ${idx + 1}`,
                                url
                            });
                        });
                    });
                }
                setDownloadLinks(links);
            } catch (err) {
                console.error('Failed to fetch download links:', err);
                setDownloadLinks([]);
            } finally {
                setDownloadLoading(false);
            }
        };
        if (film) fetchDownloadLinks();
    }, [film]);

    const handleDownloadClick = async (filmTitle, quality, linkNumber) => {
        try {
            // Use the full API URL but add log-download to the films path
            const url = `${process.env.REACT_APP_API_URL}/log-download`;
            console.log('Sending request to:', url); // Debug logfAWSdsef
            
            await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.REACT_APP_API_KEY}` // Add API key if needed
                },
                body: JSON.stringify({
                    title: filmTitle,
                    quality: quality,
                    link: `Link ${linkNumber}`
                })
            });
        } catch (error) {
            console.error('Error logging download:', error);
        }
    };

    const renderContent = () => {
        if (loading) {
            return <SkeletonLoader />;
        }

        if (error) {
            return (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#fff', position: 'relative', zIndex: 3 }}>
                    <div>Error: {error}</div>
                    <button onClick={() => navigate('/')} className="back-button">
                        Back to Home
                    </button>
                </div>
            );
        }

        if (!film) {
            return (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#fff', position: 'relative', zIndex: 3 }}>
                    <div>Film not found</div>
                    <button onClick={() => navigate('/')} className="back-button">
                        Back to Home
                    </button>
                </div>
            );
        }

        return (
            <div className="film-detail">
                <button onClick={() => navigate('/')} className="back-button">
                    <BackIcon />
                    Back
                </button>
                <div className="film-detail-grid">
                    <div className="film-detail-sidebar">
                        {/* Poster section */}
                        <div className="film-detail-poster-section">
                            {film.Poster && (
                                <img 
                                    src={film.Poster} 
                                    alt={film.Title} 
                                    className="film-detail-poster"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'fallback-image-url.jpg';
                                    }}
                                />
                            )}
                        </div>
                        
                        {/* Download buttons - only visible on desktop */}
                        <div className="desktop-download-section">
                            {downloadLoading ? (
                                <div className="download-loading">
                                    <LoadingSpinner />
                                </div>
                            ) : downloadLinks.length > 0 && (
                                <div className="download-buttons-grouped">
                                    {Object.entries(
                                        downloadLinks.reduce((acc, dl) => {
                                            const [quality] = dl.label.split(' ');
                                            acc[quality] = acc[quality] || [];
                                            acc[quality].push(dl.url);
                                            return acc;
                                        }, {})
                                    ).map(([quality, urls], idx) => (
                                        <div key={quality} className="download-quality-group">
                                            <div className="download-quality-label">{quality} Download Link</div>
                                            <div className="download-quality-links">
                                                {urls.map((url, i) => (
                                                    <a
                                                        key={i}
                                                        href={url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="download-btn"
                                                        onClick={() => handleDownloadClick(film.Title, quality, i + 1)}
                                                    >
                                                        <DownloadIcon />
                                                        Link {i + 1}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="film-detail-info">
                        <h1 className="film-detail-title">{film.Title}</h1>
                        
                        <div className="film-detail-meta">
                            <span>{film.Released}</span>
                            <span className="separator">|</span>
                            <span>{film.Runtime}</span>
                            <span className="separator">|</span>
                            <span>{film.Genre}</span>
                        </div>
                        
                        <div className="film-detail-rating">
                            <span className="film-detail-star">★</span>
                            <div>
                                <div>IMDB: {film.imdbRating}</div>
                                <div>Votes: {film.imdbVotes}</div>
                            </div>
                        </div>

                        <div className="film-detail-synopsis">
                            <h3>Synopsis</h3>
                            <p>{film.Plot}</p>
                        </div>

                        <div className="film-detail-credits">
                            <p><strong>Director:</strong> {film.Director}</p>
                            <p><strong>Writers:</strong> {film.Writer}</p>
                            <p><strong>Actors:</strong> {film.Actors}</p>
                            <p><strong>Language:</strong> {film.Language}</p>
                            <p><strong>Country:</strong> {film.Country}</p>
                            <p><strong>Awards:</strong> {film.Awards}</p>
                            <p><strong>Year:</strong> {film.Year}</p>
                        </div>
                    </div>

                    {/* Download buttons - only visible on mobile */}
                    <div className="mobile-download-section">
                        {downloadLinks.length > 0 && (
                            <div className="download-buttons-grouped">
                                {/* Same content as desktop download section */}
                                {Object.entries(
                                    downloadLinks.reduce((acc, dl) => {
                                        const [quality] = dl.label.split(' ');
                                        acc[quality] = acc[quality] || [];
                                        acc[quality].push(dl.url);
                                        return acc;
                                }, {})
                            ).map(([quality, urls], idx) => (
                                <div key={quality} className="download-quality-group">
                                    <div className="download-quality-label">{quality} Download Link</div>
                                    <div className="download-quality-links">
                                        {urls.map((url, i) => (
                                            <a
                                                key={i}
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="download-btn"
                                                onClick={() => handleDownloadClick(film.Title, quality, i + 1)}
                                            >
                                                <DownloadIcon />
                                                Link {i + 1}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="film-detail-page">
            <EndlessBackground />
            <SnowEffect />
            {renderContent()}
        </div>
    );
};

export default FilmDetail;
