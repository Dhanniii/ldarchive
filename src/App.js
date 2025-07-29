import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import FilmCard from './components/FilmCard';
import EndlessBackground from './components/EndlessBackground';
import SnowEffect from './components/SnowEffect';
import Preloader from './components/Preloader';
import HelloWorld from './components/HelloWorld';
import FilmDetail from './components/FilmDetail';
import SearchResults from './components/SearchResults';

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const FilmPage = () => {
  const navigate = useNavigate();
  const { page } = useParams();
  const [activeGenre, setActiveGenre] = useState('All');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(() => {
    const stored = localStorage.getItem('hideWelcomePopup');
    if (!stored) return true;
    
    try {
        const { value, expires } = JSON.parse(stored);
        if (new Date().getTime() > expires) {
            localStorage.removeItem('hideWelcomePopup');
            return true;
        }
        return !value;
    } catch (e) {
        localStorage.removeItem('hideWelcomePopup');
        return true;
    }
  });
  const [showChatBox, setShowChatBox] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatSent, setChatSent] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSidebarBtn, setShowSidebarBtn] = useState(true);
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSubtitleInfo, setShowSubtitleInfo] = useState(false);
  const [totalFilms, setTotalFilms] = useState(0);
  const filmsPerPage = 20;
  const lastScroll = useRef(window.scrollY);
  const currentPage = parseInt(page) || 1;
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Update the genres array to match exactly with your MongoDB data
  const genres = [
    { name: 'All' },
    { name: 'action' },    // lowercase to match MongoDB
    { name: 'drama' },
    { name: 'comedy' },
    { name: 'sci-fi' },
    { name: 'horror' },
    { name: 'romance' },
    { name: 'thriller' }
  ];

  useEffect(() => {
    const fetchFilms = async () => {
      setLoading(true);
      try {
        // Only add random parameter for page 1
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}?page=${currentPage}&limit=${filmsPerPage}`, 
          {
            headers: {
              'Authorization': `Bearer ${process.env.REACT_APP_API_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (!response.ok) {
          throw new Error('API authorization failed');
        }

        const data = await response.json();
        
        if (data.films) {
          const transformedFilms = data.films.map(film => ({
            title: film.title,
            year: film.year.toString(),
            banner: film.banner,
            synopsis: film.synopsis,
            imdbRating: film.imdbRating.toString(),
            genres: Array.isArray(film.genres) ? film.genres : [film.genres],
            downloadLink: film.downloadLink
          }));
          
          setFilms(transformedFilms);
          setTotalFilms(data.total || 0);
        }
      } catch (err) {
        console.error("Failed to fetch films:", err);
        setFilms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFilms();
  }, [currentPage]); // Refetch when page changes

  // Update pagination logic
  const totalPages = Math.ceil(totalFilms / filmsPerPage);

  // Update filtered films logic
  const filteredFilms = activeGenre === 'All' 
    ? films 
    : films.filter(film => {
        const filmGenres = film.genres.map(g => g.toLowerCase());
        return filmGenres.includes(activeGenre.toLowerCase());
      });

  // Remove the slice logic since we're now paginating on the server
  const currentFilms = activeGenre === 'All' 
    ? films 
    : films.filter(film => {
        const filmGenres = film.genres.map(g => g.toLowerCase());
        return filmGenres.includes(activeGenre.toLowerCase());
      });

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      navigate(`/page/${currentPage - 1}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      navigate(`/page/${currentPage + 1}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleDontShowAgain = () => {
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1); 
    
    localStorage.setItem('hideWelcomePopup', JSON.stringify({
        value: true,
        expires: expiryDate.getTime()
    }));
    setShowPopup(false);
  };

  // Add snow effect
  useEffect(() => {
    const canvas = document.getElementById('snow-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let snowflakes = [];
    const snowCount = Math.floor(width / 10);

    function createSnowflakes() {
      snowflakes = [];
      for (let i = 0; i < snowCount; i++) {
        snowflakes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 1.8 + 1.2,
          d: Math.random() * 1 + 0.5,
          wind: Math.random() * 0.6 - 0.3
        });
      }
    }

    function drawSnowflakes() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.globalAlpha = 0.7;
      ctx.fillStyle = "#fff";
      snowflakes.forEach(flake => {
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2, true);
        ctx.fill();
      });
      ctx.restore();
      moveSnowflakes();
    }

    function moveSnowflakes() {
      for (let flake of snowflakes) {
        flake.y += flake.d;
        flake.x += flake.wind;
        if (flake.y > height) {
          flake.y = -flake.r;
          flake.x = Math.random() * width;
        }
        if (flake.x > width || flake.x < 0) {
          flake.x = Math.random() * width;
        }
      }
    }

    let animationFrameId;
    function animate() {
      drawSnowflakes();
      animationFrameId = requestAnimationFrame(animate);
    }

    createSnowflakes();
    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      createSnowflakes();
    };

    window.addEventListener('resize', handleResize);

    // Important: Clean up on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (ctx) ctx.clearRect(0, 0, width, height);
    };
  }, []); // Empty dependency array to run once on mount

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScroll.current && currentScroll > 40) {
        setShowSidebarBtn(false); // Scroll down, hide
      } else {
        setShowSidebarBtn(true); // Scroll up, show
      }
      lastScroll.current = currentScroll;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) return <Preloader />;

  return (
    <div className="app">
      <EndlessBackground />
      <SnowEffect />

      {/* Sidebar toggle di pojok kiri atas */}
      {showSidebarBtn && (
        <button
          className={`sidebar-toggle${showSidebarBtn ? '' : ' hide'}`}
          onClick={toggleSidebar}
          aria-label="Open sidebar"
        >
          {isSidebarOpen ? '✕' : '☰'}
        </button>
      )}

      {showPopup && (
        <div className="custom-popup-overlay">
          <div className="custom-popup">
            <button className="popup-close-btn" onClick={handleClosePopup}>✕</button>
            <div className="popup-content">
              <h3>Welcome!</h3>
              <p style={{fontSize: "0.97rem", lineHeight: "1.7", marginTop: 12}}>
                Better to use <b>VLC Media Player</b> or <b>MxPlayer</b> since some movies already include subtitles.<br /><br />
                This website was created just for fun; all movies here are download-only and we only provide 1080p or 720p quality. These Movie are all sourced from piracy websites found across the internet.<br /><br />
                My purpose in creating this is so you don't have to go through shortlinks when downloading movies.<br /><br />
                <b>Sorry if the movie you're looking for isn't available</b>, If you want to request a specific movie, you can reach out through the Contact & Request <br /><br />
                Thank you
              </p>
              <div className="popup-actions">
                <label className="dont-show-again">
                  <input 
                    type="checkbox" 
                    onChange={handleDontShowAgain}
                  />
                  <span>Don't show this again</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <button 
          className="sidebar-toggle inside"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          ✕
        </button>
        <h2 className="sidebar-title">Movie Categories</h2>
        <ul className="genre-list">
          {genres.map((genre) => (
            <li
              key={genre.name}
              className={`genre-item ${activeGenre.toLowerCase() === genre.name.toLowerCase() ? 'active' : ''}`}
              onClick={() => {
                setActiveGenre(genre.name);
                if (window.innerWidth <= 768) {
                  setSidebarOpen(false);
                }
              }}
            >
              <span className="genre-icon">{genre.icon}</span>
              {/* Capitalize first letter for display */}
              {genre.name === 'All' ? genre.name : genre.name.charAt(0).toUpperCase() + genre.name.slice(1)}
            </li>
          ))}
        </ul>

        <div className="subtitle-info-wrapper">
          <button 
            className="subtitle-toggle" 
            onClick={() => setShowSubtitleInfo(prev => !prev)}
            aria-expanded={showSubtitleInfo}
          >
            <span>Subtitles</span>
            <span className="toggle-icon">{showSubtitleInfo ? '−' : '+'}</span>
          </button>
          
          {showSubtitleInfo && (
            <div className="subtitle-content">
              <p>
                No subtitles? Sorry about that! You can grab them from&nbsp;
                <a href="https://sub-scene.com" target="_blank" rel="noopener noreferrer">sub-scene.com</a>
                &nbsp;or&nbsp;
                <a href="https://subdl.com" target="_blank" rel="noopener noreferrer">subdl.com</a>
              </p>
            </div>
          )}
        </div>
      </aside>

      <main className={`main-content ${isSidebarOpen ? 'shifted' : ''}`}>
        <div className="topbar">
          <form 
            className="search-wrapper"
            onSubmit={(e) => {
              e.preventDefault();
              if (searchTerm.trim()) {
                navigate(`/search/${encodeURIComponent(searchTerm.trim())}`);
                setSearchTerm(''); // Clear search input after submission
              }
            }}
          >
            <span className="search-icon">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="9" r="7"/>
                <line x1="15" y1="15" x2="12.2" y2="12.2"/>
              </svg>
            </span>
            <input
              className="search-input"
              type="search"
              placeholder="Search movie..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              maxLength={40}
            />
          </form>
        </div>

        <div className="film-grid">
          {currentFilms.map((film, index) => (
            <FilmCard 
              key={film._id || index} 
              film={film} 
              onClick={() => navigate(`/movies/${encodeURIComponent(film.title)}`)} // Navigate to film detail
            />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button 
              className="pagination-button"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              ←
            </button>
            <span className="page-indicator">
              {currentPage} / {totalPages}
            </span>
            <button 
              className="pagination-button"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              →
            </button>
          </div>
        )}

        <div className="credits">
          © 2024–2025  LdArchive

        </div>

        {/* Search Results Component - Conditionally rendered */}
        {showSearchResults && (
          <SearchResults
            searchResults={searchResults}
            searchQuery={searchQuery}
            onBackClick={() => setShowSearchResults(false)}
            handleCardClick={handleMovieClick}
          />
        )}
      </main>

      {/* Chat Floating Button & Box */}
      <div>
        <button
          className="chat-fab"
          onClick={() => setShowChatBox(v => !v)}
          aria-label="Open chat"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </button>
        {showChatBox && (
          <div className="chat-box">
            <div className="chat-header">
              <span>Contact & Request</span>
              <button className="chat-close" onClick={() => setShowChatBox(false)}>✕</button>
            </div>
            <form
              className="chat-form"
              onSubmit={async e => {
                e.preventDefault();
                if (!chatMessage.trim()) return;
                await fetch(process.env.REACT_APP_DISCORD_WEBHOOK, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ content: chatMessage })
                });
                setChatMessage('');
                setChatSent(true);
                setTimeout(() => setChatSent(false), 2000);
              }}
            >
              <textarea
                className="chat-input"
                maxLength={50}
                placeholder="Type your message..."
                value={chatMessage}
                onChange={e => setChatMessage(e.target.value)}
                required
              />
              <button className="chat-send" type="submit" disabled={chatMessage.length === 0}>
                Send
              </button>
            </form>
            {chatSent && <div className="chat-sent">Message sent!</div>}
          </div>
        )}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FilmPage />} />
        <Route path="/page/:page" element={<FilmPage />} />
        <Route path="/movies/:title" element={<FilmDetail />} />
        <Route path="/search/:query" element={<SearchResults />} />
      </Routes>
    </Router>
  );
};

export default App;
