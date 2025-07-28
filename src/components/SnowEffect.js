import React, { useEffect, useRef } from 'react';

const SnowEffect = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    resizeCanvas();

    let snowflakes = Array(Math.floor(width / 10)).fill().map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.8 + 1.2,
      speed: Math.random() * 1 + 0.5,
      wind: Math.random() * 0.6 - 0.3
    }));

    const drawSnow = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#FFF';
      ctx.globalAlpha = 0.7;

      snowflakes.forEach(flake => {
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        ctx.fill();

        flake.y += flake.speed;
        flake.x += flake.wind;

        if (flake.y > height) {
          flake.y = -flake.radius;
          flake.x = Math.random() * width;
        }
        if (flake.x > width) flake.x = 0;
        if (flake.x < 0) flake.x = width;
      });

      animationRef.current = requestAnimationFrame(drawSnow);
    };

    window.addEventListener('resize', resizeCanvas);
    drawSnow();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return <canvas ref={canvasRef} className="snow-canvas" />;
};

export default SnowEffect;