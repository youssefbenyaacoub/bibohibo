import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';

const QUIZ_DATA = [
  {
    id: 1,
    audio: '/quiz/sound1.ogg',
    options: [
      { id: 'a', img: '/quiz/photo1_a.png', isCorrect: false },
      { id: 'b', img: '/quiz/photo1_b.png', isCorrect: true },
      { id: 'c', img: '/quiz/photo1_c.png', isCorrect: false },
    ],
  },
  {
    id: 2,
    audio: '/quiz/sound2.ogg',
    options: [
      { id: 'a', img: '/quiz/photo2_a.png', isCorrect: false },
      { id: 'b', img: '/quiz/photo2_b.png', isCorrect: false },
      { id: 'c', img: '/quiz/photo2_c.png', isCorrect: true },
    ],
  },
  {
    id: 3,
    audio: '/quiz/sound3.ogg',
    options: [
      { id: 'a', img: '/quiz/photo3_a.png', isCorrect: false },
      { id: 'b', img: '/quiz/photo3_b.png', isCorrect: false },
      { id: 'c', img: '/quiz/photo3_c.png', isCorrect: true },
    ],
  },
  {
    id: 4,
    audio: '/quiz/sound4.ogg',
    options: [
      { id: 'a', img: '/quiz/photo4_a.png', isCorrect: false },
      { id: 'b', img: '/quiz/photo4_b.png', isCorrect: true },
      { id: 'c', img: '/quiz/photo4_c.png', isCorrect: false },
    ],
  },
  {
    id: 5,
    audio: '/quiz/sound5.ogg',
    options: [
      { id: 'a', img: '/quiz/photo5_a.png', isCorrect: false },
      { id: 'b', img: '/quiz/photo5_b.png', isCorrect: true },
      { id: 'c', img: '/quiz/photo5_c.png', isCorrect: false },
    ],
  },
  {
    id: 6,
    audio: '/quiz/sound6.mp3',
    options: [
      { id: 'a', img: '/quiz/photo6_a.png', isCorrect: true },
      { id: 'b', img: '/quiz/photo6_b.png', isCorrect: false },
      { id: 'c', img: '/quiz/photo6_c.png', isCorrect: false },
    ],
  },
];

const MEMORY_IMAGES = [
  '/book_photos/Gemini_Generated_Image_1jekcc1jekcc1jek.png',
  '/book_photos/Gemini_Generated_Image_48ary148ary148ar.png',
  '/book_photos/Gemini_Generated_Image_4s5kau4s5kau4s5k.png',
  '/book_photos/Gemini_Generated_Image_6l7rpb6l7rpb6l7r.png',
  '/book_photos/Gemini_Generated_Image_6yr88a6yr88a6yr8.png',
  '/book_photos/Gemini_Generated_Image_72sybw72sybw72sy.png',
  '/book_photos/Gemini_Generated_Image_7y83w17y83w17y83.png',
  '/book_photos/Gemini_Generated_Image_b17u7ib17u7ib17u.png'
];

/* ═══════════════════════════════════════════════════
   SUB-COMPONENT: MEMORY GAME
   ═══════════════════════════════════════════════════ */
function MemoryGame({ onComplete }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [timer, setTimer] = useState(0);
  const [failedTimes, setFailedTimes] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Initialize cards
    const deck = [...MEMORY_IMAGES, ...MEMORY_IMAGES]
      .sort(() => Math.random() - 0.5)
      .map((img, idx) => ({ id: idx, img, isFlipped: false }));
    setCards(deck);
  }, []);

  useEffect(() => {
    let interval;
    if (isActive && matched.length < MEMORY_IMAGES.length) {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, matched]);

  const handleFlip = (index) => {
    if (flipped.length === 2 || matched.includes(cards[index].img) || flipped.includes(index)) return;
    if (!isActive) setIsActive(true);

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (cards[first].img === cards[second].img) {
        setMatched([...matched, cards[first].img]);
        setFlipped([]);
        if (matched.length + 1 === MEMORY_IMAGES.length) {
          confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
        }
      } else {
        setFailedTimes(f => f + 1);
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 1000 }}>
      {/* Game Stats */}
      <div style={{ display: 'flex', gap: 40, marginBottom: 30, color: '#fff', fontSize: 20, fontWeight: 700 }}>
        <div style={{ background: 'rgba(255,255,255,0.15)', padding: '10px 25px', borderRadius: 20, backdropFilter: 'blur(10px)' }}>
          ⏱ Time: {timer}s
        </div>
        <div style={{ background: 'rgba(255,255,255,0.15)', padding: '10px 25px', borderRadius: 20, backdropFilter: 'blur(10px)' }}>
          ❌ Errors: {failedTimes}
        </div>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 15, width: '100%',
        perspective: 1000
      }}>
        {cards.map((card, idx) => {
          const isFlipped = flipped.includes(idx) || matched.includes(card.img);
          return (
            <Motion.div
              key={card.id}
              onClick={() => handleFlip(idx)}
              whileHover={{ scale: 1.05 }}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, type: 'spring' }}
              style={{
                height: 140, cursor: 'pointer', position: 'relative',
                transformStyle: 'preserve-3d'
              }}
            >
              {/* Back of card */}
              <div style={{
                position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #00C9FF 0%, #92FE9D 100%)',
                borderRadius: 12, border: '4px solid #fff', boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                backfaceVisibility: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 40, color: '#fff'
              }}>?</div>
              {/* Front of card */}
              <div style={{
                position: 'absolute', inset: 0, background: '#fff',
                borderRadius: 12, border: '4px solid #fff', overflow: 'hidden',
                backfaceVisibility: 'hidden', transform: 'rotateY(180deg)',
                boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
              }}>
                <img src={card.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Memory" />
              </div>
            </Motion.div>
          );
        })}
      </div>

      {/* Completion Button */}
      {matched.length === MEMORY_IMAGES.length && (
        <Motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={onComplete}
          style={{
            marginTop: 40, padding: '18px 60px',
            background: 'linear-gradient(135deg, #FF0080 0%, #7928CA 100%)',
            color: '#fff', borderRadius: 40, border: 'none',
            fontSize: 22, fontWeight: 900, cursor: 'pointer',
            boxShadow: '0 15px 40px rgba(255,0,128,0.4)',
            textTransform: 'uppercase', letterSpacing: 2, fontFamily: "'Pally', sans-serif"
          }}
        >
          Return to Town
        </Motion.button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════ */
export default function SceneGift({ onNext }) {
  const [phase, setPhase] = useState('quiz'); // quiz, points, memory
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef(null);
  const data = QUIZ_DATA[currentQuestion];

  const playClue = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    audioRef.current = new Audio(data.audio);
    audioRef.current.play().catch(e => console.log("Audio blocked", e));
    setIsPlaying(true);
    audioRef.current.onended = () => setIsPlaying(false);
  };

  const handleSelect = (option) => {
    if (isAnswered) return;
    setSelectedId(option.id);
    setIsAnswered(true);
    if (option.isCorrect) {
      setScore(s => s + 1);
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
    }
  };

  const handleNext = () => {
    if (currentQuestion < QUIZ_DATA.length - 1) {
      setCurrentQuestion(q => q + 1);
      setIsAnswered(false);
      setSelectedId(null);
    } else {
      setPhase('points');
      confetti({ particleCount: 300, spread: 160, origin: { y: 0.3 } });
    }
  };

  return (
    <div style={{
      width: '100%', height: '100%',
      backgroundImage: 'url(/background_gift_box.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      position: 'relative',
      fontFamily: "'Pally', sans-serif",
      overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', pointerEvents: 'none' }} />

      <AnimatePresence mode="wait">
        {/* PHASE 1: QUIZ */}
        {phase === 'quiz' && (
          <Motion.div
            key="quiz"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
          >
            <div style={{ position: 'absolute', top: 40, textAlign: 'center', width: '100%' }}>
              <h1 style={{ fontSize: 48, fontWeight: 900, color: '#fff', margin: 0, textShadow: '0 4px 20px #000' }}>MEMORY QUIZ</h1>
              <div style={{ marginTop: 15, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', padding: '8px 24px', borderRadius: 30, display: 'inline-block', color: '#fff', fontWeight: 700 }}>
                Score: {score}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 30, width: '100%', maxWidth: 1400, height: '55vh', padding: '0 40px' }}>
              {data.options.map((opt, idx) => {
                const isSelected = selectedId === opt.id;
                const showCorrect = isAnswered && opt.isCorrect;
                const showWrong = isAnswered && isSelected && !opt.isCorrect;
                return (
                  <Motion.div
                    key={opt.id}
                    initial={{ opacity: 0, y: 30, rotate: (idx - 1) * 2 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={!isAnswered ? { scale: 1.05, y: -20, rotate: 0 } : {}}
                    onClick={() => handleSelect(opt)}
                    style={{
                      flex: 1, height: '100%', cursor: isAnswered ? 'default' : 'pointer', borderRadius: 12, overflow: 'hidden',
                      border: `6px solid ${showCorrect ? '#44dbc5' : (showWrong ? '#ff2a6d' : '#fff')}`, background: '#fff', position: 'relative'
                    }}
                  >
                    <img src={opt.img} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: isAnswered && !isSelected && !opt.isCorrect ? 'grayscale(1) opacity(0.4)' : 'none' }} alt="Option" />
                    {showCorrect && <div style={{ position: 'absolute', bottom: 20, right: 20, background: '#44dbc5', borderRadius: '50%', padding: 15 }}><svg width="40" height="40" viewBox="0 0 24 24" fill="white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg></div>}
                    {showWrong && <div style={{ position: 'absolute', bottom: 20, right: 20, background: '#ff2a6d', borderRadius: '50%', padding: 15 }}><svg width="40" height="40" viewBox="0 0 24 24" fill="white"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg></div>}
                  </Motion.div>
                );
              })}
            </div>

            <div style={{ marginTop: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 15 }}>
              <Motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={playClue} style={{ width: 80, height: 80, borderRadius: '50%', background: isPlaying ? '#ff2a6d' : '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isPlaying ? <svg width="30" height="30" viewBox="0 0 24 24" fill="white"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg> : <svg width="30" height="30" viewBox="0 0 24 24" fill="#000"><path d="M8 5v14l11-7z" /></svg>}
              </Motion.button>
              <span style={{ color: '#fff', fontWeight: 600 }}>{isPlaying ? 'LISTENING...' : 'PLAY SOUND CLUE'}</span>
            </div>

            {isAnswered && (
              <Motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(68,219,197,0.4)' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                style={{
                  position: 'absolute', bottom: 50,
                  padding: '18px 70px',
                  background: 'linear-gradient(135deg, #44dbc5 0%, #2ecc71 100%)',
                  color: '#fff',
                  borderRadius: 40,
                  border: 'none',
                  fontSize: 22,
                  fontWeight: 900,
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  fontFamily: "'Pally', sans-serif",
                  boxShadow: '0 15px 30px rgba(0,0,0,0.3)',
                  letterSpacing: 2
                }}
              >
                {currentQuestion < QUIZ_DATA.length - 1 ? 'Next Memory' : 'Claim Reward'}
              </Motion.button>
            )}
          </Motion.div>
        )}

        {/* PHASE 2: POINTS REVEAL */}
        {phase === 'points' && (
          <Motion.div
            key="points"
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            style={{ textAlign: 'center', zIndex: 100 }}
          >
            <h2 style={{ fontSize: 40, color: '#fff', fontWeight: 700, marginBottom: 20 }}>Quiz Complete!</h2>
            <h1 style={{ fontSize: 60, color: '#FFD700', fontWeight: 900, textShadow: '0 0 30px #FFD700' }}>YFS FREE POINTS</h1>
            <Motion.div
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              style={{ fontSize: 180, color: '#fff', lineHeight: 1, textShadow: '0 0 50px rgba(255,255,255,0.8)' }}
            >
              ∞
            </Motion.div>
            <Motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setPhase('memory')}
              style={{
                marginTop: 40, padding: '18px 50px', background: '#fff', color: '#000',
                borderRadius: 40, border: 'none', fontSize: 22, fontWeight: 900, cursor: 'pointer'
              }}
            >
              Bonus Game!
            </Motion.button>
          </Motion.div>
        )}

        {/* PHASE 3: MEMORY GAME */}
        {phase === 'memory' && (
          <Motion.div
            key="memory"
            initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
          >
            <h1 style={{ fontSize: 48, fontWeight: 900, color: '#fff', marginBottom: 20, textShadow: '0 4px 20px #000' }}>PHOTO MATCH</h1>
            <MemoryGame onComplete={onNext} />
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}