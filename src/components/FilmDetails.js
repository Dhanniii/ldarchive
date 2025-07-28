import React from 'react';

const FilmDetails = ({ synopsis, imdbRating }) => {
    return (
        <div className="film-details">
            <p><strong>Synopsis:</strong> {synopsis}</p>
            <p><strong>IMDb Rating:</strong> {imdbRating}</p>
        </div>
    );
};

export default FilmDetails;