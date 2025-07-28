import React, { useState, useEffect } from 'react';
import EndlessBackground from './EndlessBackground';

const Preloader = () => {
  const [text, setText] = useState('');
  const fullText = 'Please wait';
  const dots = '...';

  useEffect(() => {
    let currentIndex = 0;
    let isAdding = true;

    const interval = setInterval(() => {
      if (isAdding) {
        setText(fullText.slice(0, currentIndex) + dots);
        currentIndex++;
        if (currentIndex > fullText.length) {
          isAdding = false;
          currentIndex = 0;
        }
      } else {
        setText(fullText.slice(0, fullText.length - currentIndex) + dots);
        currentIndex++;
        if (currentIndex > fullText.length) {
          isAdding = true;
          currentIndex = 0;
        }
      }
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="preloader-container">
      <EndlessBackground />
      <div className="preloader-content">
        <div className="loading-text typewriter">
          {text}
        </div>
      </div>
    </div>
  );
};

export default Preloader;