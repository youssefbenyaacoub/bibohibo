import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import confetti from 'canvas-confetti';
import Cake3D from '../components/Cake3D';

export default function SceneFinale() {
  const [wished, setWished]           = useState(false);
  const [extinguished, setExtinguished] = useState(false);

  const makeWish = () => {
    const colors = ['#FF2A6D', '#FFB3C6', '#ffffff', '#FFD700', '#00F3FF'];
    confetti({ 
      particleCount: 200, 
      spread: 160, 
      origin: { x: 0.5, y: 0.6 }, 
      colors,
      gravity: 0.8,
      scalar: 1.2
    });
    
    // Extra bursts
    setTimeout(() => {
      confetti({ particleCount: 100, angle: 60, spread: 100, origin: { x: 0, y: 0.8 }, colors });
      confetti({ particleCount: 100, angle: 120, spread: 100, origin: { x: 1, y: 0.8 }, colors });
    }, 300);

    setTimeout(() => setExtinguished(true), 600);
    setTimeout(() => setWished(true), 1800);
  };

  return (
    <div style={{
      width:'100%', height:'100%',
      background:'radial-gradient(circle at 50% 40%, #2A0815 0%, #0A0105 100%)',
      position:'relative', overflow:'hidden',
    }}>

      {/* Floating Particles Background — Multiple Layers */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {[...Array(30)].map((_, i) => (
          <Motion.div
            key={`p1-${i}`}
            initial={{ 
              x: Math.random() * 100 + '%', 
              y: Math.random() * 100 + '%',
              opacity: Math.random() * 0.4,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{ 
              y: [null, '-20%'],
              opacity: [null, 0]
            }}
            transition={{ 
              duration: Math.random() * 15 + 15, 
              repeat: Infinity, 
              ease: "linear",
              delay: Math.random() * -20
            }}
            style={{
              position: 'absolute',
              width: i % 3 === 0 ? 3 : 2, 
              height: i % 3 === 0 ? 3 : 2,
              background: i % 2 === 0 ? '#FFD700' : '#FF2A6D',
              borderRadius: '50%',
              filter: 'blur(1px)',
              boxShadow: `0 0 10px ${i % 2 === 0 ? '#FFD700' : '#FF2A6D'}`
            }}
          />
        ))}
      </div>

      {/* Magical Light Beams */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        {[...Array(3)].map((_, i) => (
          <Motion.div
            key={`beam-${i}`}
            animate={{ 
              opacity: [0.1, 0.2, 0.1],
              rotate: [i * 30, i * 30 + 10, i * 30]
            }}
            transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: 'absolute',
              top: '-50%', left: '50%',
              width: '100vw', height: '200vh',
              background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(255,42,109,0.05) 20deg, transparent 40deg)`,
              transformOrigin: 'center center',
            }}
          />
        ))}
      </div>

      {/* Vignette */}
      <div style={{
        position:'absolute', inset:0, pointerEvents:'none',
        background:'radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.8) 100%)',
        zIndex: 2
      }}/>

      {/* 3D Cake */}
      <Motion.div
        initial={{ opacity:0, scale:0.8, y: 50 }}
        animate={{ opacity:1, scale:1, y: 0 }}
        transition={{ duration:1.5, ease:[0.16,1,0.3,1] }}
        style={{ position:'absolute', inset: 0, zIndex:1 }}
      >
        <Cake3D extinguished={extinguished}/>
      </Motion.div>

      {/* Header UI */}
      <Motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1.2 }}
        style={{
          position: 'absolute', top: 40, left: 0, right: 0,
          zIndex: 10, textAlign: 'center'
        }}
      >
        <Motion.h1 
          animate={{ 
            textShadow: [
              '0 0 30px rgba(255,42,109,0.5)',
              '0 0 50px rgba(255,42,109,0.8), 0 0 80px rgba(255,42,109,0.4)',
              '0 0 30px rgba(255,42,109,0.5)'
            ]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{
            fontSize: 'clamp(22px, 8vw, 40px)',
            color: '#FFFFFF',
            fontFamily: "'Orange Avenue', sans-serif",
            fontWeight: 400,
            margin: 0,
            letterSpacing: '0.02em',
            width: '100%',
            padding: '0 24px',
            lineHeight: 1.1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <span>Happy 22nd</span>
          <span>Birthday</span>
        </Motion.h1>
        
        <AnimatePresence mode="wait">
          {!wished ? (
            <Motion.p
              key="wish-prompt"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                fontSize: 'clamp(12px, 3vw, 15px)', 
                color: 'rgba(255,179,198,0.8)',
                fontFamily: "'Pally', sans-serif",
                marginTop: 8,
                letterSpacing: '0.1em',
                textTransform: 'lowercase',
                padding: '0 20px'
              }}
            >
              make a wish and click the button
            </Motion.p>
          ) : null}
        </AnimatePresence>
      </Motion.div>

      {/* Floor glow */}
      <Motion.div
        animate={{ 
          opacity: extinguished ? 0 : [0.3, 0.6, 0.3],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 4, repeat: Infinity }}
        style={{
          position:'absolute', bottom:'10%', left: '50%', transform: 'translateX(-50%)',
          width: 500, height: 100, borderRadius:'50%',
          background:'radial-gradient(ellipse, rgba(255,180,50,0.2), transparent 70%)',
          filter:'blur(30px)', pointerEvents:'none',
          zIndex: 0
        }}
      />

      {/* Make a Wish Button */}
      <AnimatePresence>
        {!wished && (
            <Motion.button
            initial={{ opacity:0, y:40 }}
            animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, scale:0.9, filter: 'blur(10px)' }}
            transition={{ delay:1, duration:0.8 }}
            whileHover={{ scale:1.05 }}
            whileTap={{ scale:0.95 }}
            onClick={makeWish}
            style={{
              background:'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              color:'#FFFFFF',
              border:'1px solid rgba(255, 255, 255, 0.2)',
              padding:'16px 48px',
              borderRadius: 20,
              fontSize: 'clamp(16px, 4vw, 20px)', 
              fontFamily: "'Pally', sans-serif",
              fontWeight: 600,
              letterSpacing:'0.1em',
              cursor:'pointer',
              position:'absolute', bottom: '12%', left: 0, right: 0, marginInline: 'auto',
              width: 'fit-content',
              zIndex: 20,
              boxShadow: '0 20px 40px rgba(0,0,0,0.3), inset 0 0 20px rgba(255,255,255,0.05)',
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap',
              textAlign: 'center'
            }}
          >
            <Motion.span
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Make a Wish ♥
            </Motion.span>
          </Motion.button>
        )}
      </AnimatePresence>

      {/* ═══ FINALE OVERLAY ═══ */}
      <AnimatePresence>
        {wished && (
          <Motion.div
            initial={{ opacity:0 }}
            animate={{ opacity:1 }}
            transition={{ duration:1.5 }}
            style={{
              position:'absolute', inset:0,
              background:'rgba(5, 0, 10, 0.85)',
              backdropFilter: 'blur(15px)',
              WebkitBackdropFilter: 'blur(15px)',
              display:'flex', flexDirection:'column',
              alignItems:'center', justifyContent:'center',
              zIndex:100,
            }}
          >
            {/* Pulsing Aura */}
            <Motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{
                position:'absolute', width: 800, height: 800, borderRadius:'50%',
                background:'radial-gradient(circle, #FF2A6D 0%, transparent 70%)',
                pointerEvents:'none',
              }}
            />

            {/* Main text with shimmer */}
            <Motion.div
              initial={{ opacity:0, scale:0.7, y:60 }}
              animate={{ opacity:1, scale:1, y:0 }}
              transition={{ delay:0.5, duration:2, ease:[0.16,1,0.3,1] }}
              style={{
                textAlign:'center',
                position:'relative', zIndex:1,
              }}
            >
              <Motion.h2 
                animate={{ 
                  textShadow: [
                    '0 0 40px rgba(255,42,109,0.8), 0 0 100px rgba(255,42,109,0.4)',
                    '0 0 60px rgba(255,42,109,1), 0 0 120px rgba(255,42,109,0.6)',
                    '0 0 40px rgba(255,42,109,0.8), 0 0 100px rgba(255,42,109,0.4)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  fontSize:'clamp(40px, 10vw, 120px)',
                  color:'#FFFFFF',
                  fontFamily: "'Orange Avenue', sans-serif",
                  lineHeight: 1.1,
                  margin: 0,
                  textAlign: 'center',
                  padding: '0 20px',
                  width: '100%'
                }}
              >
                I Love You
              </Motion.h2>
              
              <Motion.p
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: 1,
                  letterSpacing: ['0.2em', '0.3em', '0.2em']
                }}
                transition={{ 
                  opacity: { delay: 1.5, duration: 1 },
                  letterSpacing: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                }}
                style={{
                  fontSize:'clamp(16px, 2.5vw, 28px)',
                  color:'rgba(255, 179, 200, 0.9)',
                  fontFamily: "'Pally', sans-serif",
                  marginTop: 20,
                  textTransform: 'uppercase'
                }}
              >
                Happy 22nd Birthday
              </Motion.p>
            </Motion.div>

            {/* Floating Hearts — Improved Animation */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
              {[...Array(30)].map((_, i) => (
                <Motion.div
                  key={`heart-${i}`}
                  initial={{ 
                    y: '100vh',
                    x: `${Math.random() * 100}vw`,
                    scale: Math.random() * 0.6 + 0.4,
                    rotate: Math.random() * 360,
                    opacity: 0
                  }}
                  animate={{ 
                    y: '-110vh',
                    rotate: Math.random() * 360 + 720,
                    opacity: [0, 1, 1, 0]
                  }}
                  transition={{ 
                    duration: Math.random() * 8 + 7, 
                    repeat: Infinity, 
                    delay: Math.random() * 15,
                    ease: "linear"
                  }}
                  style={{
                    position: 'absolute',
                    fontSize: Math.random() * 20 + 25,
                    color: i % 3 === 0 ? '#FF2A6D' : i % 3 === 1 ? '#FFB3C6' : '#FFFFFF',
                    textShadow: '0 0 15px rgba(255,42,109,0.5)',
                  }}
                >
                  ♥
                </Motion.div>
              ))}
            </div>

            {/* Replay */}
            <Motion.button
              initial={{ opacity:0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3, duration: 1 }}
              whileHover={{ scale: 1.1, color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.6)' }}
              onClick={() => { setWished(false); setExtinguished(false); }}
              style={{
                marginTop: 80,
                background:'transparent',
                border:'1px solid rgba(255,255,255,0.2)',
                color:'rgba(255,255,255,0.4)',
                padding:'12px 32px',
                borderRadius: 100,
                fontSize: 14, 
                cursor:'pointer',
                fontFamily: "'Pally', sans-serif",
                letterSpacing: '0.1em',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              ↻ replay experience
            </Motion.button>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}