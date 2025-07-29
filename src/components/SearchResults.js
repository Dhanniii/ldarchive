import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FilmCard from './FilmCard';
import Preloader from './Preloader';
import '../styles/components.css'; // Add this import if not already imported

const SearchResults = () => {
  const { query } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isSubscribed = true;
    const controller = new AbortController();

    const fetchResults = async () => {
      try {
        if (!isSubscribed) return;
        setLoading(true);
        
        const baseUrl = process.env.REACT_APP_API_URL.replace('/films', '');
        
        const response = await fetch(
          `${baseUrl}/search?q=${encodeURIComponent(query)}`,
          {
            headers: {
              'Authorization': `Bearer ${process.env.REACT_APP_API_KEY}`,
              'Content-Type': 'application/json'
            },
            signal: controller.signal
          }
        );

        const data = await response.json();

        if (!response.ok || data.error) {
          throw new Error(data.error || 'Search failed');
        }

        if (isSubscribed) {
          setResults(data.films || []);
          setError(null);
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error('Search error:', err);
        if (isSubscribed) {
          setError(err.message);
          setResults([]);
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    if (query?.trim()) {
      fetchResults();
    } else {
      setResults([]);
      setLoading(false);
    }

    return () => {
      isSubscribed = false;
      controller.abort();
    };
  }, [query]);

  if (loading) return <Preloader />;

  return (
    <div className="search-results">
      <div className="search-header">
        <button
          onClick={() => navigate(-1)}
          className="back-button"
          aria-label="Go back"
        >
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back
        </button>
        <h2>Search Results for "{query}"</h2>
        {!error && <p>{results.length} results found</p>}
      </div>

      {!error && results.length > 0 && (
        <div className="film-grid">
          {results.map((film) => (
            <FilmCard
              key={film._id}
              film={film}
              onClick={() => navigate(`/movies/${encodeURIComponent(film.title)}`)}
            />
          ))}
        </div>
      )}

      {results.length === 0 && !error && (
        <div className="no-results">
          No movies found for "{query}"
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
};

export default SearchResults;