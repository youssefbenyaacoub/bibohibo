import { useState, useEffect, useRef, useCallback } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';

/* ═══════════════════════════════════════════════════
   MUSIC TRACKS — one for each scene
   Using reliable sources + local file for hub
   ═══════════════════════════════════════════════════ */
const MUSIC_MAP = {
  welcome: '/Heat Waves (Slowed).mp3',
  hub:     '/minecraft_bg_music.mp3',
  house:   '/Yazan Haifawi - Wainek Min Zaman  يزن حيفاوي - وينك من زمان.mp3',
  gallery: '/Bruno Mars - Talking To The Moon (Official Lyric Video).mp3',
  gift:    '/Harry Styles - As It Was (Lyrics).mp3',
  finale:  '/Mac Miller - Congratulations (feat. Bilal).mp3',
};

export default function AudioManager({ sceneType }) {
  const audioRef = useRef(null);
  const currentTrackRef = useRef(null);
  const fadeInIntervalRef = useRef(null);
  const volumeRef = useRef(0.3);
  const [needsInteraction, setNeedsInteraction] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);

  const updateVolume = useCallback((nextVolume) => {
    const clampedVolume = Math.min(1, Math.max(0, Number(nextVolume.toFixed(2))));
    volumeRef.current = clampedVolume;
    setVolume(clampedVolume);

    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
  }, []);

  const decreaseVolume = useCallback(() => {
    updateVolume(volumeRef.current - 0.1);
  }, [updateVolume]);

  const increaseVolume = useCallback(() => {
    updateVolume(volumeRef.current + 0.1);
  }, [updateVolume]);

  const startPlayback = useCallback(() => {
    if (!audioRef.current) return;
    if (fadeInIntervalRef.current) {
      clearInterval(fadeInIntervalRef.current);
      fadeInIntervalRef.current = null;
    }

    audioRef.current.play().then(() => {
      setIsPlaying(true);
      setNeedsInteraction(false);
      // Fade in
      fadeInIntervalRef.current = setInterval(() => {
        if (audioRef.current && audioRef.current.volume < volumeRef.current) {
          audioRef.current.volume = Math.min(volumeRef.current, audioRef.current.volume + 0.02);
        } else {
          if (fadeInIntervalRef.current) {
            clearInterval(fadeInIntervalRef.current);
            fadeInIntervalRef.current = null;
          }
        }
      }, 80);
    }).catch(() => {
      setNeedsInteraction(true);
    });
  }, []);

  useEffect(() => {
    const trackUrl = MUSIC_MAP[sceneType];
    if (!trackUrl) return;

    // Skip if same track
    if (currentTrackRef.current === trackUrl && audioRef.current) return;

    // Fade out current if playing
    if (audioRef.current) {
      const oldAudio = audioRef.current;
      const fadeOut = setInterval(() => {
        if (oldAudio.volume > 0.03) {
          oldAudio.volume = Math.max(0, oldAudio.volume - 0.03);
        } else {
          clearInterval(fadeOut);
          oldAudio.pause();
          oldAudio.src = '';
        }
      }, 50);
    }

    // Create new audio after brief delay for crossfade
    setTimeout(() => {
      const newAudio = new Audio(trackUrl);
      newAudio.loop = true;
      newAudio.volume = 0;
      audioRef.current = newAudio;
      currentTrackRef.current = trackUrl;

      startPlayback();
    }, 400);
  }, [sceneType, startPlayback]);

  // Click-anywhere listener for autoplay policy
  useEffect(() => {
    if (!needsInteraction) return;

    const handleClick = () => {
      startPlayback();
      window.removeEventListener('click', handleClick);
      window.removeEventListener('touchstart', handleClick);
    };

    window.addEventListener('click', handleClick);
    window.addEventListener('touchstart', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('touchstart', handleClick);
    };
  }, [needsInteraction, startPlayback]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (fadeInIntervalRef.current) {
        clearInterval(fadeInIntervalRef.current);
      }

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  // Music indicator UI
  return (
    <AnimatePresence>
      {needsInteraction && (
        <Motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          onClick={startPlayback}
          style={{
            position: 'fixed', top: 10, right: 10,
            background: 'rgba(0,0,0,0.75)',
            color: '#fff', padding: '8px 16px',
            borderRadius: 20, cursor: 'pointer',
            fontSize: 12, fontWeight: 600,
            zIndex: 9999,
            border: '1px solid rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', gap: 6,
            backdropFilter: 'blur(5px)',
          }}
        >
          <span style={{ fontSize: 16 }}>🔇</span>
          Click for music
        </Motion.div>
      )}
      {isPlaying && (
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            position: 'fixed', top: 10, right: 10,
            background: 'rgba(0,0,0,0.5)',
            color: 'rgba(255,255,255,0.6)', padding: '6px 12px',
            borderRadius: 16, fontSize: 11, fontWeight: 500,
            zIndex: 9998,
            display: 'flex', alignItems: 'center', gap: 5,
            pointerEvents: 'none',
          }}
        >
          <Motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ fontSize: 12 }}
          >♫</Motion.span>
          Now playing
        </Motion.div>
      )}

      {isPlaying && (
        <Motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'fixed', bottom: 12, right: 12,
            background: 'rgba(0,0,0,0.65)',
            color: '#fff', padding: '8px 10px',
            borderRadius: 14,
            border: '1px solid rgba(255,255,255,0.2)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            backdropFilter: 'blur(5px)',
          }}
        >
          <button
            onClick={decreaseVolume}
            style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.35)',
              background: 'transparent',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 700,
              lineHeight: 1,
            }}
            aria-label="Decrease volume"
          >
            -
          </button>
          <span style={{ fontSize: 12, minWidth: 70, textAlign: 'center' }}>
            Volume {Math.round(volume * 100)}%
          </span>
          <button
            onClick={increaseVolume}
            style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.35)',
              background: 'transparent',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 700,
              lineHeight: 1,
            }}
            aria-label="Increase volume"
          >
            +
          </button>
        </Motion.div>
      )}
    </AnimatePresence>
  );
}
