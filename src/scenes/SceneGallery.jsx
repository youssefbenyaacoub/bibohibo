import { AnimatePresence, motion as Motion } from 'framer-motion';
import { useEffect, useRef, useState, useCallback } from 'react';

/* ═══════════════════════════════════════════════════
   MEMORY DATA
   ═══════════════════════════════════════════════════ */
const photoFiles = [
  'Gemini_Generated_Image_1jekcc1jekcc1jek.png', 'Gemini_Generated_Image_48ary148ary148ar.png',
  'Gemini_Generated_Image_4s5kau4s5kau4s5k.png', 'Gemini_Generated_Image_6l7rpb6l7rpb6l7r.png',
  'Gemini_Generated_Image_6yr88a6yr88a6yr8.png', 'Gemini_Generated_Image_72sybw72sybw72sy.png',
  'Gemini_Generated_Image_7y83w17y83w17y83.png', 'Gemini_Generated_Image_b17u7ib17u7ib17u.png',
  'Gemini_Generated_Image_cv1mjzcv1mjzcv1m.png', 'Gemini_Generated_Image_ei4mmvei4mmvei4m.png',
  'Gemini_Generated_Image_gfg8yhgfg8yhgfg8.png', 'Gemini_Generated_Image_gi5uypgi5uypgi5u.png',
  'Gemini_Generated_Image_gsd65bgsd65bgsd6.png', 'Gemini_Generated_Image_j3xxfj3xxfj3xxfj.png',
  'Gemini_Generated_Image_ku1idmku1idmku1i.png', 'Gemini_Generated_Image_l2zeg8l2zeg8l2ze.png',
  'Gemini_Generated_Image_o0xtopo0xtopo0xt.png', 'Gemini_Generated_Image_oc5dzooc5dzooc5d.png',
  'Gemini_Generated_Image_q3vhnbq3vhnbq3vh.png', 'Gemini_Generated_Image_soimidsoimidsoim.png',
  'Gemini_Generated_Image_wwm6wswwm6wswwm6.png', 'Gemini_Generated_Image_za3aqbza3aqbza3a.png'
];

const memories = [
  { id: 1,  caption: 'You Always Support Me', text: 'Whenever I feel lost, you are the first person there to guide me back. Your support is my greatest comfort.', image: `/book_photos/${photoFiles[0]}` },
  { id: 2,  caption: 'Your Belief In Me', text: 'Even when I don\'t believe in myself, you do. Having you in my corner makes me feel like I can do anything.', image: `/book_photos/${photoFiles[1]}` },
  { id: 3,  caption: 'The Way You Listen', text: 'I feel like I can tell you my deepest secrets and you truly understand. You make me feel so seen.', image: `/book_photos/${photoFiles[2]}` },
  { id: 4,  caption: 'How You Make Me Laugh', text: 'Your sense of humour is one of a kind. You can turn even the most ordinary day into a beautiful memory.', image: `/book_photos/${photoFiles[3]}` },
  { id: 5,  caption: 'Your Gentle Heart', text: 'Just being near you makes me feel at peace. Your kindness is the most beautiful thing about you.', image: `/book_photos/${photoFiles[4]}` },
  { id: 6,  caption: 'Our Shared Dreams', text: 'Talking about our future together is my favorite part of the day. I love that we dream as one.', image: `/book_photos/${photoFiles[5]}` },
  { id: 7,  caption: 'Your Little Gestures', text: 'The small things you do for me, without ever being asked, show me how deeply you care for me.', image: `/book_photos/${photoFiles[6]}` },
  { id: 8,  caption: 'The Way You Inspire Me', text: 'You push me to be the best version of myself every single day. I am so lucky to learn from you.', image: `/book_photos/${photoFiles[7]}` },
  { id: 9,  caption: 'Your Endless Patience', text: 'I know I can be difficult sometimes, but you handle me with such grace. Thank you for staying by my side.', image: `/book_photos/${photoFiles[8]}` },
  { id: 10, caption: 'How You Celebrate Me', text: 'Whether it\'s a big win or a small joy, you celebrate me with so much love. It makes me feel like the luckiest person.', image: `/book_photos/${photoFiles[9]}` },
  { id: 11, caption: 'Our Inside Jokes', text: 'The things that only we understand make our bond feel so rare and precious. I love our secret world.', image: `/book_photos/${photoFiles[10]}` },
  { id: 12, caption: 'The Way You Forgive', text: 'When I stumble, you lead with compassion and love. You\'ve shown me the true meaning of a kind soul.', image: `/book_photos/${photoFiles[11]}` },
  { id: 13, caption: 'Your Wise Advice', text: 'I can always trust you to give me the most honest and caring perspective. You are my guiding light.', image: `/book_photos/${photoFiles[12]}` },
  { id: 14, caption: 'The Way You Protect Us', text: 'I always feel safe and secure with you. Knowing we are a team makes me feel like I can take on the world.', image: `/book_photos/${photoFiles[13]}` },
  { id: 15, caption: 'Our Quiet Moments', text: 'I love that we can just be ourselves together in silence. It is the most comfortable feeling in the world.', image: `/book_photos/${photoFiles[14]}` },
  { id: 16, caption: 'Your Radiant Energy', text: 'Watching you light up a room makes me so proud to be yours. Your spirit is genuinely captivating.', image: `/book_photos/${photoFiles[15]}` },
  { id: 17, caption: 'Your Beautiful Soul', text: 'The way you care for the world around you is so inspiring. You have a heart of pure gold.', image: `/book_photos/${photoFiles[16]}` },
  { id: 18, caption: 'The Way You Love Me', text: 'In everything you do, you make sure I know how much I mean to you. I am blessed to be loved by you.', image: `/book_photos/${photoFiles[17]}` },
  { id: 19, caption: 'Our Beautiful Adventures', text: 'Every trip, every walk, and every shared laugh is a memory I will hold close to my heart forever.', image: `/book_photos/${photoFiles[18]}` },
  { id: 20, caption: 'Your Brilliant Mind', text: 'Your intelligence and quick wit always keep me captivated. I love every conversation we have.', image: `/book_photos/${photoFiles[19]}` },
  { id: 21, caption: 'Your Authentic Beauty', text: 'You are perfectly, wonderfully, and unapologetically yourself. To me, you are the most beautiful person alive.', image: `/book_photos/${photoFiles[20]}` },
  { id: 22, caption: 'Simply Being You', text: 'The best reason of all is just that you exist. I wouldn\'t change a single thing about our beautiful journey.', image: `/book_photos/${photoFiles[21]}` },
];

const BOOK_COLORS = [
  '#1A73E8', '#D32F2F', '#388E3C', '#7B1FA2', '#F57C00',
  '#00838F', '#C2185B', '#1565C0', '#4E342E', '#00695C',
  '#AD1457',
];

/* ═══════════════════════════════════════════════════
   SIMS 4 SVG NEED ICONS — authentic circular icons
   ═══════════════════════════════════════════════════ */
function NeedIcon({ type, size = 32 }) {
  const icons = {
    fun: { bg: '#4CAF50', icon: (
      <g transform="translate(16,16)">
        <circle cx="0" cy="0" r="12" fill="none"/>
        <circle cx="-4" cy="-3" r="1.8" fill="#fff"/>
        <circle cx="4" cy="-3" r="1.8" fill="#fff"/>
        <path d="M-6,3 Q0,9 6,3" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
      </g>
    )},
    energy: { bg: '#FF9800', icon: (
      <g transform="translate(16,16)">
        <path d="M-2,-10 L-6,2 L-1,0 L2,10 L6,-2 L1,0 Z" fill="#fff"/>
      </g>
    )},
    hygiene: { bg: '#4CAF50', icon: (
      <g transform="translate(16,16)">
        <ellipse cx="0" cy="4" rx="7" ry="5" fill="none" stroke="#fff" strokeWidth="2"/>
        <path d="M-4,-2 Q-4,-8 0,-8 Q4,-8 4,-2" fill="none" stroke="#fff" strokeWidth="2"/>
        <circle cx="0" cy="-8" r="2" fill="#fff"/>
      </g>
    )},
    social: { bg: '#FF9800', icon: (
      <g transform="translate(16,16)">
        <ellipse cx="-3" cy="0" rx="6" ry="5" fill="none" stroke="#fff" strokeWidth="1.8"/>
        <ellipse cx="4" cy="-2" rx="5" ry="4" fill="none" stroke="#fff" strokeWidth="1.8"/>
      </g>
    )},
    hunger: { bg: '#4CAF50', icon: (
      <g transform="translate(16,16)">
        <line x1="-6" y1="-8" x2="-6" y2="8" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
        <line x1="0" y1="-8" x2="0" y2="8" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
        <path d="M4,-8 Q10,-4 4,2 L4,8" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
      </g>
    )},
    bladder: { bg: '#4CAF50', icon: (
      <g transform="translate(16,16)">
        <path d="M-5,-8 L-5,0 Q-5,8 0,8 Q5,8 5,0 L5,-8" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
        <path d="M-3,-5 Q0,-2 3,-5" fill="none" stroke="#fff" strokeWidth="1.5"/>
      </g>
    )},
  };
  const data = icons[type] || icons.fun;
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: data.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      border: '2px solid #fff',
      flexShrink: 0,
    }}>
      <svg width={size} height={size} viewBox="0 0 32 32">{data.icon}</svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SIMS 4 NEED BAR — authentic layout like the game
   Labels on top, white bar bg, colored fill, circular icon
   ═══════════════════════════════════════════════════ */
function SimsNeedBar({ label, value, type }) {
  const clr = value > 60 ? '#00E640' : value > 30 ? '#FFD700' : '#FF3333';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
      <NeedIcon type={type} size={30} />
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: 11, fontWeight: 700, color: '#2D4F3E',
          marginBottom: 3, textTransform: 'capitalize',
        }}>{label}</div>
        <div style={{
          width: '100%', height: 16, borderRadius: 8,
          background: '#fff',
          border: '1px solid #ccc',
          overflow: 'hidden',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
        }}>
          <Motion.div
            animate={{ width: `${value}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{
              height: '100%', borderRadius: 7,
              background: clr,
              boxShadow: `0 0 4px ${clr}66`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SVG PLUMBOB — the real Sims diamond
   ═══════════════════════════════════════════════════ */
function Plumbob({ size = 28 }) {
  return (
    <Motion.div
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      style={{ filter: 'drop-shadow(0 0 8px rgba(57,231,95,0.8))' }}
    >
      <svg width={size} height={size * 1.4} viewBox="0 0 60 84">
        <polygon points="30,0 60,42 30,42" fill="#5CFF7E" />
        <polygon points="30,0 0,42 30,42" fill="#39E75F" />
        <polygon points="30,84 60,42 30,42" fill="#2BC34A" />
        <polygon points="30,84 0,42 30,42" fill="#1FA83B" />
        <polygon points="30,0 45,21 30,42 15,21" fill="rgba(255,255,255,0.25)" />
      </svg>
    </Motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   BOOK SPINE — clickable on the shelf
   ═══════════════════════════════════════════════════ */
function BookSpine({ memory, index, color, onSelect, isRead }) {
  const h = 150 + Math.sin(index * 1.7) * 25;
  const w = 30 + (index % 3) * 4;
  return (
    <Motion.div
      whileHover={{ y: -18, scale: 1.06, zIndex: 10 }}
      whileTap={{ scale: 0.96 }}
      onClick={() => onSelect(memory)}
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.06, type: 'spring', stiffness: 200 }}
      style={{
        width: w, height: h,
        background: `linear-gradient(160deg, ${color}ee, ${color}bb, ${color}dd)`,
        borderRadius: '3px 5px 5px 3px',
        cursor: 'pointer',
        position: 'relative',
        boxShadow: `inset -4px 0 8px rgba(0,0,0,0.35), inset 4px 0 6px rgba(255,255,255,0.08), 3px 5px 12px rgba(0,0,0,0.5)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transformOrigin: 'bottom center',
        alignSelf: 'flex-end',
      }}
    >
      <div style={{
        writingMode: 'vertical-rl', textOrientation: 'mixed',
        color: 'rgba(255,255,255,0.92)', fontSize: 8, fontWeight: 700,
        letterSpacing: 0.8, textTransform: 'uppercase',
        transform: 'rotate(180deg)',
        maxHeight: h - 40, overflow: 'hidden',
        textShadow: '0 1px 3px rgba(0,0,0,0.6)',
        fontFamily: "'Pally', sans-serif",
      }}>
        {memory.caption}
      </div>
      <div style={{ position: 'absolute', top: 10, left: 5, right: 5, height: 1.5, background: 'rgba(255,215,0,0.45)', borderRadius: 1 }} />
      <div style={{ position: 'absolute', bottom: 10, left: 5, right: 5, height: 1.5, background: 'rgba(255,215,0,0.45)', borderRadius: 1 }} />
      {isRead && (
        <Motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={{
            position: 'absolute', top: -6, right: -6,
            width: 16, height: 16, borderRadius: '50%',
            background: '#39E75F', border: '2px solid #fff',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 8, color: '#fff', fontWeight: 900, zIndex: 5,
          }}
        >✓</Motion.div>
      )}
    </Motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   OPEN BOOK — MOUSE DRAG page flipping
   ═══════════════════════════════════════════════════ */
function OpenBook({ memory, memoryIndex, onClose, onFlip, total, onFinish }) {
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [flipAnim, setFlipAnim] = useState(null);
  const startXRef = useRef(0);

  const canPrev = memoryIndex > 0;
  const canNext = memoryIndex < total - 1;
  const isLast = memoryIndex === total - 1;

  const handlePointerDown = (e) => {
    setIsDragging(true);
    startXRef.current = e.clientX || e.touches?.[0]?.clientX || 0;
    setDragX(0);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const currentX = e.clientX || e.touches?.[0]?.clientX || 0;
    setDragX(currentX - startXRef.current);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const threshold = 80;
    if (dragX < -threshold && (canNext || isLast)) {
      setFlipAnim('right');
      setTimeout(() => {
        if (isLast) onFinish();
        else onFlip(memoryIndex + 1);
        setFlipAnim(null);
      }, 400);
    } else if (dragX > threshold && canPrev) {
      setFlipAnim('left');
      setTimeout(() => {
        onFlip(memoryIndex - 1);
        setFlipAnim(null);
      }, 400);
    }
    setDragX(0);
  };

  const rightPageRotate = isDragging && dragX < 0 ? Math.max(-45, dragX * 0.2) : 0;
  const leftPageRotate = isDragging && dragX > 0 ? Math.min(45, dragX * 0.2) : 0;

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'fixed', inset: 0,
        background: 'radial-gradient(ellipse at center, rgba(0,20,40,0.75), rgba(0,0,0,0.92))',
        backdropFilter: 'blur(15px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', zIndex: 1000,
        cursor: isDragging ? 'grabbing' : 'default',
        userSelect: 'none',
      }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Close button removed as requested */}

      {/* The Book */}
      <Motion.div
        initial={{ scale: 0.5, rotateY: -60, opacity: 0 }}
        animate={{ scale: 1, rotateY: 0, opacity: 1 }}
        exit={{ scale: 0.5, rotateY: 60, opacity: 0 }}
        transition={{ type: 'spring', damping: 18, stiffness: 90 }}
        onPointerDown={handlePointerDown}
        style={{
          width: 'min(92vw, 1000px)',
          height: 'min(70vh, 550px)',
          perspective: 2500,
          cursor: isDragging ? 'grabbing' : 'grab',
          marginTop: 30,
        }}
      >
        {/* Book base shadow */}
        <div style={{
          position: 'absolute', inset: 0,
          boxShadow: '0 30px 80px rgba(0,0,0,0.7)',
          borderRadius: 8,
        }} />

        {/* Leather cover */}
        <div style={{
          width: '100%', height: '100%',
          background: 'linear-gradient(145deg, #0095D9, #0080C0, #39E75F)',
          borderRadius: 8, padding: 5, display: 'flex',
          position: 'relative',
          boxShadow: 'inset 0 0 30px rgba(0,0,0,0.4), inset 0 0 3px rgba(255,255,255,0.1)',
        }}>
          {/* Spine */}
          <div style={{
            position: 'absolute', left: 'calc(50% - 6px)', top: 3, bottom: 3, width: 12,
            background: 'linear-gradient(90deg, #005A8C, #0095D9, #005A8C)',
            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.6)', zIndex: 5, borderRadius: 1,
          }} />
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute', left: 'calc(50% - 1px)', top: `${10 + i * 11}%`,
              width: 2, height: 6, background: 'rgba(200,160,100,0.3)', borderRadius: 1, zIndex: 6,
            }} />
          ))}

          {/* LEFT PAGE: PHOTO */}
          <AnimatePresence mode="wait">
            <Motion.div
              key={`photo-${memory.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, rotateY: leftPageRotate + (flipAnim === 'left' ? 90 : 0) }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                flex: 1, background: 'linear-gradient(135deg, #FFF8E7, #F5E6C8ee)',
                borderRadius: '5px 0 0 5px', padding: '28px 24px 20px',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                position: 'relative', overflow: 'hidden',
                transformOrigin: 'right center', transformStyle: 'preserve-3d',
              }}
            >
              {/* Page lines */}
              <div style={{
                position: 'absolute', inset: 0, opacity: 0.4,
                background: 'repeating-linear-gradient(0deg, transparent, transparent 30px, rgba(180,160,130,0.15) 30px, rgba(180,160,130,0.15) 31px)',
                pointerEvents: 'none',
              }} />
              {/* Photo polaroid */}
              <Motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                style={{
                  width: '88%', maxHeight: '78%',
                  background: '#fff', padding: 8,
                  boxShadow: '0 6px 25px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.05)',
                  transform: 'rotate(-1deg)',
                }}
              >
                <img
                  src={memory.image}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  alt={memory.caption} draggable={false}
                />
              </Motion.div>
              <p style={{
                marginTop: 14, fontFamily: "'Pally', sans-serif",
                fontStyle: 'italic', fontSize: 13, color: '#8B7355',
              }}>Memory #{memory.id}</p>
              <span style={{ position: 'absolute', bottom: 10, left: 18, fontSize: 11, color: '#C4A97D', fontFamily: "'Pally', sans-serif" }}>
                {memory.id * 2 - 1}
              </span>
            </Motion.div>
          </AnimatePresence>

          {/* RIGHT PAGE: TEXT */}
          <AnimatePresence mode="wait">
            <Motion.div
              key={`text-${memory.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, rotateY: rightPageRotate + (flipAnim === 'right' ? -90 : 0) }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                flex: 1, background: 'linear-gradient(225deg, #FFF8E7, #F5E6C8ee)',
                borderRadius: '0 5px 5px 0', padding: '32px 28px 20px 24px',
                display: 'flex', flexDirection: 'column',
                position: 'relative', overflow: 'hidden',
                transformOrigin: 'left center', transformStyle: 'preserve-3d',
              }}
            >
              <div style={{
                position: 'absolute', inset: 0, opacity: 0.4,
                background: 'repeating-linear-gradient(0deg, transparent, transparent 30px, rgba(180,160,130,0.15) 30px, rgba(180,160,130,0.15) 31px)',
                pointerEvents: 'none',
              }} />
              {/* Decorative divider */}
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
                <svg width="180" height="12" viewBox="0 0 180 12">
                  <line x1="0" y1="6" x2="60" y2="6" stroke="#C4A97D" strokeWidth="1" />
                  <circle cx="70" cy="6" r="2" fill="#C4A97D" />
                  <circle cx="90" cy="6" r="3" fill="#C4A97D" />
                  <circle cx="110" cy="6" r="2" fill="#C4A97D" />
                  <line x1="120" y1="6" x2="180" y2="6" stroke="#C4A97D" strokeWidth="1" />
                </svg>
              </div>
              <Motion.h2
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                style={{
                  fontSize: 24, color: '#3A2518', fontFamily: "'Pally', sans-serif",
                  fontWeight: 700, lineHeight: 1.3, marginBottom: 14, margin: 0,
                  borderBottom: '1px solid #D4B896', paddingBottom: 10,
                }}
              >{memory.caption}</Motion.h2>
              <div style={{ fontSize: 52, color: 'rgba(180,150,110,0.2)', fontFamily: "'Pally', sans-serif", lineHeight: 0.5, marginBottom: 6, marginTop: 10 }}>❝</div>
              <Motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                style={{
                  flex: 1, fontSize: 15, color: '#4A3A2A',
                  fontFamily: "'Pally', sans-serif", lineHeight: 1.9,
                  fontStyle: 'italic', textAlign: 'justify',
                }}
              >{memory.text}</Motion.p>
              <div style={{ textAlign: 'center', marginTop: 12 }}>
                <svg width="60" height="16" viewBox="0 0 60 16"><path d="M0,8 Q15,0 30,8 Q45,16 60,8" fill="none" stroke="#C4A97D" strokeWidth="1.5" /></svg>
              </div>
              <span style={{ position: 'absolute', bottom: 10, right: 18, fontSize: 11, color: '#C4A97D', fontFamily: "'Pally', sans-serif" }}>
                {memory.id * 2}
              </span>
            </Motion.div>
          </AnimatePresence>
        </div>
      </Motion.div>

      {/* Drag hint animation */}
      <Motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.7, 0.7, 0], x: [0, -30, 30, 0] }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 5, delay: 2 }}
        style={{
          marginTop: 18, display: 'flex', alignItems: 'center', gap: 8,
          color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l-7 7 7 7" /></svg>
        Drag to flip pages
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l7 7-7 7" /></svg>
      </Motion.div>

      {/* Finish button on last page */}
      {isLast && (
        <Motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(57,231,95,0.4)' }}
          whileTap={{ scale: 0.95 }}
          onClick={onFinish}
          style={{
            marginTop: 20, padding: '16px 48px',
            background: 'linear-gradient(135deg, #39E75F 0%, #2BC34A 100%)',
            border: 'none',
            borderRadius: 40, 
            color: '#fff', 
            cursor: 'pointer',
            fontWeight: 800, 
            fontSize: 18, 
            letterSpacing: 2,
            boxShadow: '0 15px 30px rgba(0,0,0,0.3)',
            textTransform: 'uppercase',
            fontFamily: "'Pally', sans-serif",
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}
        >
          <span style={{ fontSize: 22 }}>✓</span>
          Complete Album
        </Motion.button>
      )}
    </Motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN SCENE
   ═══════════════════════════════════════════════════ */
export default function SceneGallery({ onNext }) {
  const [selectedMemoryIdx, setSelectedMemoryIdx] = useState(0);
  const [readBooks, setReadBooks] = useState([memories[0].id]);
  const [showMoodlet, setShowMoodlet] = useState(false);
  const [moodletText, setMoodletText] = useState('');
  const [funValue, setFunValue] = useState(42); // Increased from 35 as first book is read
  const [isFinishing, setIsFinishing] = useState(false);

  const triggerMoodlet = useCallback((text) => {
    setMoodletText(text);
    setShowMoodlet(true);
    setTimeout(() => setShowMoodlet(false), 3500);
  }, []);

  const handleSelectBook = (memory) => {
    const idx = memories.findIndex(m => m.id === memory.id);
    setSelectedMemoryIdx(idx);
    if (!readBooks.includes(memory.id)) {
      setReadBooks(prev => [...prev, memory.id]);
      setFunValue(prev => Math.min(100, prev + 7));
      triggerMoodlet(`"${memory.caption}" +3 Fun`);
    }
  };

  const handleFlip = (newIdx) => {
    setSelectedMemoryIdx(newIdx);
    const mem = memories[newIdx];
    if (mem && !readBooks.includes(mem.id)) {
      setReadBooks(prev => [...prev, mem.id]);
      setFunValue(prev => Math.min(100, prev + 7));
    }
  };

  const isTransitioning = useRef(false);
  const handleFinish = () => {
    if (isFinishing || isTransitioning.current) return;
    isTransitioning.current = true;
    setIsFinishing(true);
    setTimeout(() => {
      onNext();
    }, 1200);
  };

  return (
    <div style={{
      width: '100%', height: '100%',
      position: 'relative', overflow: 'hidden',
      fontFamily: "'Pally', sans-serif",
    }}>
      {/* ── BACKGROUND ── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'url("/background_gift_box.png") center/cover no-repeat',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(0,20,40,0.4) 0%, rgba(0,10,30,0.5) 50%, rgba(0,0,0,0.6) 100%)',
      }} />

      {/* Floating particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <Motion.div
          key={i}
          animate={{
            y: [-20, -(typeof window !== 'undefined' ? window.innerHeight : 800)],
            opacity: [0, 0.4, 0],
          }}
          transition={{ duration: 8 + i * 1.5, repeat: Infinity, delay: i * 0.9, ease: 'linear' }}
          style={{
            position: 'absolute', bottom: 0, left: `${5 + i * 6}%`,
            width: 3, height: 3, borderRadius: '50%',
            background: '#7BFFAB', pointerEvents: 'none', zIndex: 1,
          }}
        />
      ))}

      {/* ═══ LOGO ═══ */}
      <div style={{ position: 'absolute', bottom: 20, left: 20, zIndex: 1100 }}>
        <img
          src="/les_sims_4_logo.png"
          style={{ height: 50, filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.5))' }}
          alt="Les Sims 4"
        />
      </div>

      {/* ═══ THE BOOK ═══ */}
      <OpenBook
        memory={memories[selectedMemoryIdx]}
        memoryIndex={selectedMemoryIdx}
        total={memories.length}
        onFlip={handleFlip}
        onFinish={handleFinish}
      />

      {/* ── FINISH FADE ── */}
      <AnimatePresence>
        {isFinishing && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            style={{
              position: 'fixed', inset: 0,
              background: '#000', zIndex: 2000,
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
