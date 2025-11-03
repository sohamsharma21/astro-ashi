
import React, { useEffect, useState } from 'react';

interface StarBackgroundProps {
  starCount?: number;
}

const StarBackground: React.FC<StarBackgroundProps> = ({ starCount = 100 }) => {
  const [stars, setStars] = useState<{ x: number; y: number; size: number; delay: number }[]>([]);

  useEffect(() => {
    const generateStars = () => {
      const newStars = [];
      for (let i = 0; i < starCount; i++) {
        newStars.push({
          x: Math.random() * 100, // percentage of viewport width
          y: Math.random() * 100, // percentage of viewport height
          size: Math.random() * 2 + 1, // size between 1-3px
          delay: Math.random() * 3, // animation delay
        });
      }
      setStars(newStars);
    };

    generateStars();

    // Regenerate stars on window resize for responsiveness
    const handleResize = () => {
      generateStars();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [starCount]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map((star, index) => (
        <div
          key={index}
          className="star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default StarBackground;
