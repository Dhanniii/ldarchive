import React from 'react';

const DownloadButton = ({ downloadLink }) => {
    return (
        <div className="download-button">
            <a 
                href={downloadLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="download-link"
            >
                Download Film
            </a>
        </div>
    );
};

export default DownloadButton;