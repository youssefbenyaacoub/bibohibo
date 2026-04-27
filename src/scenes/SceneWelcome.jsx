import { AnimatePresence, motion as Motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';

const HEART_COLORS = ['#FF2A6D', '#FF5F9C', '#FFB3C6', '#FFC8E0'];
const BALLOON_COLORS = [
  ['#FF8FC2', '#FF2A6D'],
  ['#FFD0E6', '#FF6FAE'],
  ['#FFB3C6', '#FF3D84'],
  ['#FFC2DC', '#E51E67'],
];

function seeded(seed, salt = 1) {
  const value = Math.sin((seed + 1) * 12.9898 * (salt + 0.41)) * 43758.5453;
  return value - Math.floor(value);
}

function createBalloon(id, variant = 0, isTrap = false) {
  const token = id + variant * 37;
  const side = seeded(token, 90) > 0.5;
  const left = side ? (5 + seeded(token, 91) * 20) : (75 + seeded(token, 92) * 20);
  const top = 10 + seeded(token, 93) * 70;

  // Trap balloons are black, regular ones use the color palette
  const colorPair = isTrap
    ? ['#333333', '#000000']
    : BALLOON_COLORS[id % BALLOON_COLORS.length];

  return {
    id,
    left,
    top,
    isTrap,
    width: 40 + seeded(token, 94) * 20,
    height: 55 + seeded(token, 95) * 25,
    drift: 15 + seeded(token, 96) * 30,
    duration: 10 + seeded(token, 97) * 4,
    delay: seeded(token, 98) * 3,
    colorA: colorPair[0],
    colorB: colorPair[1],
  };
}

export default function SceneWelcome({ onNext }) {
  const [poppedCount, setPoppedCount] = useState(0);
  const [balloons, setBalloons] = useState(() => {
    const initial = Array.from({ length: 11 }, (_, i) => createBalloon(i));
    // Add one trap balloon initially
    initial.push(createBalloon(11, 0, true));
    return initial;
  });
  const [popEffects, setPopEffects] = useState([]);
  const [isFinishing, setIsFinishing] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hearts, setHearts] = useState([]);
  const containerRef = useRef(null);

  const [shake, setShake] = useState(false);

  const spawnPopEffect = (xPct, yPct, color) => {
    const id = Date.now() + Math.random();

    // Play pop sound
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
    audio.volume = 0.4;
    audio.play().catch(e => console.log("Audio play blocked", e));

    // Shake effect
    setShake(true);
    setTimeout(() => setShake(false), 200);

    const particles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      angle: (i / 15) * Math.PI * 2,
      distance: 80 + Math.random() * 100,
    }));

    setPopEffects(prev => [...prev, { id, x: xPct, y: yPct, color, particles }]);
    setTimeout(() => {
      setPopEffects(prev => prev.filter(p => p.id !== id));
    }, 800);
  };

  const isTransitioning = useRef(false);

  const popBalloon = (id, isTrap, left, top, color) => {
    if (isFinishing || isTransitioning.current) return;

    spawnPopEffect(left, top, color);

    if (isTrap) {
      setPoppedCount(0);
      setBalloons(prev => prev.map(b => b.id === id ? createBalloon(id, Math.random() * 1000, true) : b));
      return;
    }

    setPoppedCount(prev => {
      const next = prev + 1;
      if (next >= 22 && !isTransitioning.current) {
        isTransitioning.current = true;
        setIsFinishing(true);
        setTimeout(onNext, 2000);
      }
      return next;
    });

    // Respawn regular balloon, occasionally turn it into a trap if there isn't one
    setBalloons(prev => {
      const hasTrap = prev.some(b => b.isTrap && b.id !== id);
      const shouldBecomeTrap = !hasTrap && Math.random() > 0.7;
      return prev.map(b => b.id === id ? createBalloon(id, Math.random() * 100, shouldBecomeTrap) : b);
    });
  };

  const handlePointerMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    // Spawn trail hearts occasionally
    if (Math.random() > 0.8) {
      const id = Date.now() + Math.random();
      setHearts(prev => [...prev.slice(-20), {
        id, x, y,
        color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
        size: 10 + Math.random() * 15,
        vx: (Math.random() - 0.5) * 100,
        vy: -50 - Math.random() * 100
      }]);
      setTimeout(() => {
        setHearts(prev => prev.filter(h => h.id !== id));
      }, 1000);
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setMousePos({ x: -100, y: -100 })} // Hide off-screen
      style={{
        width: '100%', height: '100%',
        position: 'relative', overflow: 'hidden',
        background: 'radial-gradient(circle at center, #1a001a 0%, #050005 100%)',
        fontFamily: "'Pally', sans-serif",
        cursor: 'none'
      }}
    >
      {/* ── POP EFFECTS ── */}
      {popEffects.map(effect => (
        <div key={effect.id} style={{ position: 'absolute', left: `${effect.x}%`, top: `${effect.y}%`, pointerEvents: 'none', zIndex: 30 }}>
          {/* Shockwave Ring */}
          <Motion.div
            initial={{ scale: 0, opacity: 0.8, border: `2px solid ${effect.color}` }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              position: 'absolute', top: -20, left: -20,
              width: 40, height: 40, borderRadius: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          />
          {effect.particles.map(p => (
            <Motion.div
              key={p.id}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: Math.cos(p.angle) * p.distance,
                y: Math.sin(p.angle) * p.distance,
                opacity: 0,
                scale: 0.5
              }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                width: 6, height: 6,
                borderRadius: '50%',
                background: effect.color,
                boxShadow: `0 0 10px ${effect.color}`
              }}
            />
          ))}
        </div>
      ))}

      {/* ── AMBIENT BACKGROUND ── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at 50% 50%, rgba(255, 42, 109, 0.05) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Floating particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <Motion.div
          key={i}
          animate={{
            y: [-10, -1000],
            opacity: [0, 0.4, 0],
          }}
          transition={{
            duration: 10 + Math.random() * 15,
            repeat: Infinity,
            delay: Math.random() * 10,
          }}
          style={{
            position: 'absolute', bottom: 0,
            left: `${Math.random() * 100}%`,
            width: 2, height: 2, borderRadius: '50%',
            background: '#ff2a6d',
            pointerEvents: 'none'
          }}
        />
      ))}

      {/* ── THE BALLOONS ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 5 }}>
        {balloons.map((b) => (
          <Motion.div
            key={b.id}
            onClick={() => popBalloon(b.id, b.isTrap, b.left, b.top, b.colorB)}
            initial={{ y: 200, opacity: 0 }}
            animate={{
              y: [0, -b.drift, 0],
              x: [0, Math.sin(b.id) * 15, 0],
              opacity: 1,
              rotate: [Math.sin(b.id) * 3, Math.sin(b.id) * -3, Math.sin(b.id) * 3]
            }}
            transition={{
              duration: b.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: b.delay
            }}
            whileHover={{ scale: 1.15, zIndex: 20 }}
            whileTap={{ scale: 0.85 }}
            style={{
              position: 'absolute',
              left: `${b.left}%`,
              top: `${b.top}%`,
              width: b.width,
              height: b.height,
              cursor: 'pointer',
              zIndex: 10
            }}
          >
            {/* Trap Message */}
            {b.isTrap && (
              <div style={{
                position: 'absolute', top: -30, left: '50%', transform: 'translateX(-50%)',
                background: '#fff', color: '#000', padding: '2px 8px', borderRadius: 10,
                fontSize: 10, fontWeight: 700, whiteSpace: 'nowrap',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
              }}>
                DON'T POP ME!
              </div>
            )}

            {/* Balloon Body */}
            <div style={{
              width: '100%',
              height: '100%',
              background: `radial-gradient(circle at 30% 30%, ${b.isTrap ? '#666' : '#fff'} 0%, transparent 20%), linear-gradient(135deg, ${b.colorA}, ${b.colorB})`,
              borderRadius: '50% 50% 50% 50% / 45% 45% 55% 55%',
              boxShadow: `0 10px 25px ${b.colorB}44, inset -5px -5px 15px rgba(0,0,0,0.2)`,
              position: 'relative'
            }}>
              {/* Highlight */}
              <div style={{
                position: 'absolute', top: '15%', left: '15%', width: '20%', height: '20%',
                background: 'rgba(255,255,255,0.3)', borderRadius: '50%', filter: 'blur(2px)'
              }} />
            </div>

            {/* Knot */}
            <div style={{
              position: 'absolute', bottom: -4, left: '50%',
              width: 10, height: 6, background: b.colorB,
              transform: 'translateX(-50%)', borderRadius: '40% 40% 50% 50%'
            }} />

            {/* String */}
            <div style={{
              position: 'absolute', bottom: -60, left: '50%',
              width: 1.5, height: 60,
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)',
              transform: 'translateX(-50%)'
            }} />
          </Motion.div>
        ))}
      </div>

      {/* ── CENTER PIECE ── */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center', zIndex: 10,
        pointerEvents: 'none',
        width: '100%'
      }}>
        <Motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <span style={{
            fontSize: 'clamp(140px, 20vw, 280px)',
            fontWeight: 700,
            lineHeight: 0.8,
            letterSpacing: '-0.05em',
            background: 'linear-gradient(to bottom, #fff 20%, #ff2a6d 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 30px rgba(255, 42, 109, 0.3))',
          }}>22</span>

          <Motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            style={{
              fontSize: 'clamp(28px, 4vw, 56px)',
              color: '#fff',
              margin: '20px 0 10px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}
          >
            Happy Birthday
          </Motion.h1>

          <Motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            style={{
              fontSize: 'clamp(16px, 1.5vw, 20px)',
              color: 'rgba(255,255,255,0.6)',
              maxWidth: 600,
              margin: '0 auto 40px',
              fontWeight: 400
            }}
          >
            Pop 22 balloons to unlock the celebration.
          </Motion.p>

          {/* Progress Bar */}
          <div style={{
            width: 300, height: 4, background: 'rgba(255,255,255,0.1)',
            margin: '0 auto', borderRadius: 2, overflow: 'hidden', position: 'relative'
          }}>
            <Motion.div
              animate={{ width: `${(poppedCount / 22) * 100}%` }}
              style={{
                height: '100%', background: '#ff2a6d',
                boxShadow: '0 0 15px #ff2a6d'
              }}
            />
          </div>
          <p style={{ marginTop: 15, color: '#ff2a6d', fontSize: 14, fontWeight: 700, letterSpacing: 2 }}>
            {poppedCount} / 22 POPPED
          </p>
        </Motion.div>
      </div>

      {/* ── CURSOR TRAIL ── */}
      {hearts.map(h => (
        <Motion.div
          key={h.id}
          initial={{ x: h.x, y: h.y, opacity: 1, scale: 1 }}
          animate={{ x: h.x + h.vx, y: h.y + h.vy, opacity: 0, scale: 0 }}
          transition={{ duration: 1 }}
          style={{
            position: 'absolute', top: 0, left: 0,
            color: h.color, fontSize: h.size, pointerEvents: 'none'
          }}
        >❤</Motion.div>
      ))}

      {/* ── CUSTOM CURSOR ── */}
      <Motion.div
        animate={{
          x: mousePos.x,
          y: mousePos.y,
        }}
        transition={{ type: 'tween', ease: 'linear', duration: 0 }}
        style={{
          position: 'absolute', top: -15, left: -15,
          width: 30, height: 30,
          background: 'rgba(255,255,255,0.1)',
          border: '2px solid #fff',
          borderRadius: '50%',
          zIndex: 100,
          pointerEvents: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
      >
        <div style={{ width: 4, height: 4, background: '#fff', borderRadius: '50%' }} />
      </Motion.div>

      {/* ── FADE TO BLACK ── */}
      <AnimatePresence>
        {isFinishing && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            style={{
              position: 'fixed', inset: 0,
              background: '#000', zIndex: 2000,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <Motion.h2
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5 }}
              style={{ color: '#fff', fontSize: 32, fontWeight: 700 }}
            >
              Opening the town...
            </Motion.h2>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}