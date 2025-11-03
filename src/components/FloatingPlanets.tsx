
import { useEffect, useRef } from 'react';

interface Planet {
  size: string;
  color: string;
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  animationDelay: string;
}

const FloatingPlanets = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Planets configuration
    const planets: Planet[] = [
      { 
        size: '150px', 
        color: '#5c4cc4', 
        position: { top: '35%', left: '-5%' }, 
        animationDelay: '0s' 
      },
      { 
        size: '120px', 
        color: '#cc6633', 
        position: { bottom: '15%', right: '-3%' }, 
        animationDelay: '5s' 
      },
      { 
        size: '80px', 
        color: '#8925A9', 
        position: { top: '12%', right: '10%' }, 
        animationDelay: '2s' 
      },
      { 
        size: '100px', 
        color: '#3a7bd5', 
        position: { bottom: '30%', left: '5%' }, 
        animationDelay: '7s' 
      },
      { 
        size: '60px', 
        color: '#d53a9d', 
        position: { top: '60%', right: '15%' }, 
        animationDelay: '3s' 
      },
    ];

    // Create planets
    if (containerRef.current) {
      planets.forEach((planet) => {
        const planetEl = document.createElement('div');
        planetEl.className = 'floating-planet';
        planetEl.style.width = planet.size;
        planetEl.style.height = planet.size;
        planetEl.style.backgroundColor = planet.color;
        planetEl.style.borderRadius = '50%';
        planetEl.style.filter = 'blur(40px)';
        
        // Set position
        if (planet.position.top) planetEl.style.top = planet.position.top;
        if (planet.position.bottom) planetEl.style.bottom = planet.position.bottom;
        if (planet.position.left) planetEl.style.left = planet.position.left;
        if (planet.position.right) planetEl.style.right = planet.position.right;
        
        // Set animation
        planetEl.style.animation = `float 20s infinite alternate ease-in-out, glow 8s infinite alternate ease-in-out`;
        planetEl.style.animationDelay = planet.animationDelay;
        
        containerRef.current.appendChild(planetEl);
      });
    }

    // Cleanup function
    return () => {
      if (containerRef.current) {
        const planets = containerRef.current.querySelectorAll('.floating-planet');
        planets.forEach(planet => planet.remove());
      }
    };
  }, []);

  return <div ref={containerRef} className="planets-container" />;
};

export default FloatingPlanets;
