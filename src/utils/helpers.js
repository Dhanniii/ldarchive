// src/utils/helpers.js

export const formatRating = (rating) => {
    return rating ? `${rating}/10` : 'N/A';
};

export const truncateSynopsis = (synopsis, maxLength = 100) => {
    return synopsis.length > maxLength ? `${synopsis.substring(0, maxLength)}...` : synopsis;
};