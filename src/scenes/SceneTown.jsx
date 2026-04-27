import { useState, useEffect, useRef } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';

// Coordinates for building doors (Percentage of width/height)
const TRIGGERS = [
  { id: 1, name: 'Welcome House', x: 15, y: 62, color: '#ff6b9d' },
  { id: 2, name: 'Memory Gallery', x: 70, y: 45, color: '#44dbc5' },
  { id: 3, name: 'Gift Shop',      x: 88, y: 65, color: '#ff2a6d' },
  { id: 4, name: 'Cake Altar',     x: 47, y: 60, color: '#ffd700' },
];

export default function SceneTown({ currentStep, onEnter, completedSteps }) {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [activeTrigger, setActiveTrigger] = useState(null);
  const keysPressed = useRef(new Set());
  const requestRef = useRef();

  // Movement Logic
  const move = () => {
    setPos(prev => {
      let dx = 0;
      let dy = 0;
      const speed = 0.15;

      if (keysPressed.current.has('arrowup'))    dy -= speed;
      if (keysPressed.current.has('arrowdown'))  dy += speed;
      if (keysPressed.current.has('arrowleft'))  dx -= speed;
      if (keysPressed.current.has('arrowright')) dx += speed;

      const nextX = Math.max(2, Math.min(98, prev.x + dx));
      const nextY = Math.max(2, Math.min(98, prev.y + dy));

      return { x: nextX, y: nextY };
    });
    requestRef.current = requestAnimationFrame(move);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressed.current.add(e.key.toLowerCase());
      keysPressed.current.add(e.code); // Store physical key code as well
      
      if ((e.key.toLowerCase() === 'e' || e.code === 'KeyE') && activeTrigger) {
        onEnter(activeTrigger.id);
      }
    };
    const handleKeyUp = (e) => {
      keysPressed.current.delete(e.key.toLowerCase());
      keysPressed.current.delete(e.code);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    requestRef.current = requestAnimationFrame(move);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(requestRef.current);
    };
  }, [activeTrigger, onEnter]);

  // Proximity Detection
  useEffect(() => {
    const threshold = 7; // Slightly larger for easier interaction
    const nearby = TRIGGERS.find(t => {
      const dist = Math.hypot(t.x - pos.x, t.y - pos.y);
      return dist < threshold && t.id === currentStep;
    });
    setActiveTrigger(nearby || null);
  }, [pos, currentStep, completedSteps]);

  return (
    <div style={{
      width: '100%', height: '100%',
      backgroundImage: 'url(/town_background.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Pally', sans-serif"
    }}>
      {/* Overlay for map depth/lighting */}
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.15)', pointerEvents:'none' }} />

      {/* Target Highlights */}
      {TRIGGERS.map(t => {
        const isCompleted = completedSteps.includes(t.id);
        const isActive = t.id === currentStep;
        
        return (
          <div key={t.id} style={{
            position:'absolute',
            left: `${t.x}%`, top: `${t.y}%`,
            transform: 'translate(-50%, -50%)',
            width: 80, height: 80,
            borderRadius: '50%',
            border: `3px dashed ${isCompleted ? '#fff' : (isActive ? t.color : 'rgba(255,255,255,0.15)')}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: isCompleted ? 'rgba(0,0,0,0.4)' : 'transparent',
            zIndex: 5,
            transition: 'all 0.4s ease'
          }}>
            {isCompleted && <span style={{ color:'#fff', fontSize:24, fontWeight:'bold' }}>❌</span>}
          </div>
        );
      })}

      {/* Character */}
      <Motion.div
        animate={{
          left: `${pos.x}%`,
          top: `${pos.y}%`,
          scale: [1, 1.05, 1],
        }}
        transition={{
          left: { type:'tween', ease: 'linear', duration: 0.05 },
          top: { type:'tween', ease: 'linear', duration: 0.05 },
          scale: { repeat:Infinity, duration:0.6 }
        }}
        style={{
          position: 'absolute',
          width: 70, height: 70,
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.3))'
        }}
      >
        <img src="/character.png" style={{ 
          width:'100%', 
          imageRendering:'pixelated',
          display: 'block'
        }} alt="Girl" />
      </Motion.div>

      {/* ── UI Elements ── */}
      <div style={{
        position: 'absolute', top: 30, left: '50%', transform: 'translateX(-50%)',
        textAlign: 'center', color: '#fff',
        zIndex: 20, width: '100%'
      }}>
        <h1 style={{ 
          fontSize: 48, margin: '0 0 10px 0', fontWeight: 700, 
          textTransform: 'uppercase', letterSpacing: '0.1em',
          textShadow: '0 4px 20px rgba(0,0,0,0.5)'
        }}>Birthday Town</h1>
        
        <div style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20,
          background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)',
          padding: '12px 24px', borderRadius: 20, width: 'fit-content', margin: '0 auto',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ display: 'flex', gap: 4 }}>
            <Key label="←" /> <Key label="↑" /> <Key label="↓" /> <Key label="→" />
          </div>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginLeft: 10 }}>TO MOVE</span>
        </div>
      </div>

      {/* "Press E" Prompt */}
      <AnimatePresence>
        {activeTrigger && (
          <Motion.div
            initial={{ opacity:0, y:-20 }}
            animate={{ opacity:1, y:0 }}
            exit={{ opacity:0 }}
            style={{
              position: 'absolute',
              left: `${pos.x}%`, top: `${pos.y - 12}%`,
              transform: 'translateX(-50%)',
              background: 'rgba(255,255,255,0.95)', border: 'none',
              padding: '8px 16px', color: '#000',
              fontWeight: 700, fontSize: 18, zIndex: 30,
              borderRadius: 12,
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
              display: 'flex', alignItems: 'center', gap: 10
            }}
          >
            <Key label="E" dark />
            <span>Enter {activeTrigger.name}</span>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Small helper for visual keys
function Key({ label, dark }) {
  return (
    <div style={{
      width: 32, height: 32,
      background: dark ? '#000' : 'rgba(255,255,255,0.2)',
      borderRadius: 6,
      borderBottom: `3px solid ${dark ? '#333' : 'rgba(255,255,255,0.3)'}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 14, fontWeight: 700, color: dark ? '#fff' : '#fff',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)'
    }}>
      {label}
    </div>
  );
}
