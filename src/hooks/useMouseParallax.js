import { useState, useEffect } from 'react';

export default function useMouseParallax(strength = 0.015) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e) => {
      const x = (e.clientX / window.innerWidth  - 0.5) * strength;
      const y = (e.clientY / window.innerHeight - 0.5) * strength;
      setPos({ x, y });
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, [strength]);

  return pos;
}