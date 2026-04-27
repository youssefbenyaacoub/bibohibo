import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useRef } from 'react';

function Candle({ position, extinguished, index }) {
  const flameRef = useRef();
  const innerRef = useRef();
  const lightRef = useRef();
  
  useFrame(({ clock }) => {
    if (!extinguished) {
      const t = clock.elapsedTime;
      const flicker = Math.sin(t * 20 + index * 10) * 0.1 + Math.sin(t * 7 + index) * 0.05;
      
      if (flameRef.current) {
        flameRef.current.scale.y = 1 + flicker;
        flameRef.current.scale.x = 1 + flicker * 0.5;
        flameRef.current.position.y = 0.42 + Math.sin(t * 15 + index) * 0.01;
      }
      if (innerRef.current) {
        innerRef.current.scale.y = 1 + flicker * 0.8;
      }
      if (lightRef.current) {
        lightRef.current.intensity = 0.4 + flicker * 0.2;
      }
    }
  });

  return (
    <group position={position}>
      {/* Candle body — pink/white striped style */}
      <mesh>
        <cylinderGeometry args={[0.04, 0.045, 0.5, 16]}/>
        <meshPhysicalMaterial 
          color="#FFD6E7" 
          emissive="#FF80A0" 
          emissiveIntensity={0.1}
          roughness={0.3}
          clearcoat={1}
        />
      </mesh>
      {/* Wick */}
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.05, 6]}/>
        <meshStandardMaterial color="#222"/>
      </mesh>
      {!extinguished && (
        <>
          {/* Outer flame */}
          <mesh ref={flameRef} position={[0, 0.42, 0]}>
            <coneGeometry args={[0.08, 0.25, 12]}/>
            <meshBasicMaterial color="#FFB800" transparent opacity={0.8}/>
          </mesh>
          {/* Inner flame */}
          <mesh ref={innerRef} position={[0, 0.38, 0]}>
            <coneGeometry args={[0.04, 0.14, 8]}/>
            <meshBasicMaterial color="#FFFDF0" transparent opacity={0.9}/>
          </mesh>
          {/* Candle glow light */}
          <pointLight 
            ref={lightRef}
            color="#FFD700" 
            intensity={0.5} 
            distance={1.5} 
            position={[0, 0.5, 0]}
          />
        </>
      )}
    </group>
  );
}

function CreamSwirl({ position, scale = 1 }) {
  return (
    <mesh position={position} scale={scale}>
      <sphereGeometry args={[0.12, 16, 16]}/>
      <meshPhysicalMaterial 
        color="#FFFFFF" 
        roughness={0.1} 
        clearcoat={1} 
        emissive="#fff" 
        emissiveIntensity={0.1}
      />
    </mesh>
  );
}

function Sprinkle({ position, color }) {
  return (
    <mesh position={position} rotation={[Math.random(), Math.random(), Math.random()]}>
      <capsuleGeometry args={[0.015, 0.04, 4, 8]}/>
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.2}/>
    </mesh>
  );
}

function CakeMesh({ extinguished }) {
  const candlePositions = [];
  const sprinklePositions = [];
  const sprinkleColors = ['#FF2A6D', '#FFD700', '#00F3FF', '#FFFFFF', '#FFB3C6'];

  // 22 candles
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2;
    candlePositions.push([Math.cos(angle) * 0.6, 4.1, Math.sin(angle) * 0.6]);
  }
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2 + 0.3;
    candlePositions.push([Math.cos(angle) * 1.3, 3.05, Math.sin(angle) * 1.3]);
  }
  for (let i = 0; i < 9; i++) {
    const angle = (i / 9) * Math.PI * 2 + 0.15;
    candlePositions.push([Math.cos(angle) * 2.0, 1.65, Math.sin(angle) * 2.0]);
  }

  // Random sprinkles
  for (let i = 0; i < 60; i++) {
    const tier = Math.floor(Math.random() * 3);
    const angle = Math.random() * Math.PI * 2;
    const r = tier === 0 ? Math.random() * 0.9 : tier === 1 ? Math.random() * 1.5 : Math.random() * 2.1;
    const h = tier === 0 ? 3.86 : tier === 1 ? 2.78 : tier === 2 ? 1.41 : 0;
    sprinklePositions.push({ pos: [Math.cos(angle) * r, h, Math.sin(angle) * r], color: sprinkleColors[i % sprinkleColors.length] });
  }

  return (
    <group>
      {/* ── CAKE STAND ── */}
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[2.8, 3.2, 0.4, 64]}/>
        <meshPhysicalMaterial color="#FFFFFF" metalness={0.1} roughness={0.1} clearcoat={1}/>
      </mesh>
      <mesh position={[0, -0.8, 0]}>
        <cylinderGeometry args={[1.2, 1.5, 1.0, 32]}/>
        <meshPhysicalMaterial color="#FFFFFF" metalness={0.1} roughness={0.1} clearcoat={1}/>
      </mesh>

      {/* ── BASE TIER ── */}
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[2.4, 2.5, 1.4, 64]}/>
        <meshPhysicalMaterial color="#FFD6E7" roughness={0.4} clearcoat={0.5}
          emissive="#FF80A0" emissiveIntensity={0.05}/>
      </mesh>
      {/* Cream rim — base */}
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i / 24) * Math.PI * 2;
        return <CreamSwirl key={`c-b-${i}`} position={[Math.cos(a) * 2.45, 1.42, Math.sin(a) * 2.45]} scale={1.2}/>;
      })}

      {/* ── MID TIER ── */}
      <mesh position={[0, 2.15, 0]}>
        <cylinderGeometry args={[1.7, 1.85, 1.25, 64]}/>
        <meshPhysicalMaterial color="#FFB3C6" roughness={0.4} clearcoat={0.5}
          emissive="#FF6090" emissiveIntensity={0.05}/>
      </mesh>
      {/* Cream rim — mid */}
      {Array.from({ length: 18 }).map((_, i) => {
        const a = (i / 18) * Math.PI * 2;
        return <CreamSwirl key={`c-m-${i}`} position={[Math.cos(a) * 1.75, 2.79, Math.sin(a) * 1.75]} scale={1.1}/>;
      })}

      {/* ── TOP TIER ── */}
      <mesh position={[0, 3.35, 0]}>
        <cylinderGeometry args={[1.1, 1.25, 1.0, 64]}/>
        <meshPhysicalMaterial color="#FFD6E7" roughness={0.4} clearcoat={0.5}
          emissive="#FF80A0" emissiveIntensity={0.05}/>
      </mesh>
      {/* Cream rim — top */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <CreamSwirl key={`c-t-${i}`} position={[Math.cos(a) * 1.15, 3.87, Math.sin(a) * 1.15]} scale={1}/>;
      })}

      {/* ── SPRINKLES ── */}
      {sprinklePositions.map((s, i) => (
        <Sprinkle key={`s-${i}`} position={s.pos} color={s.color}/>
      ))}

      {/* ── CANDLES ── */}
      {candlePositions.map((pos, i) => (
        <Candle key={i} position={pos} extinguished={extinguished} index={i}/>
      ))}
    </group>
  );
}

export default function Cake3D({ extinguished }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <Canvas
      camera={{ 
        position: isMobile ? [0, 4.5, 12] : [0, 4, 10], 
        fov: isMobile ? 40 : 35 
      }}
      style={{ width:'100%', height:'100%', background:'transparent' }}
      shadows
    >
      {/* Lighting */}
      <ambientLight color="#FFE0F0" intensity={0.8}/>
      <spotLight 
        position={[5, 10, 5]} 
        angle={0.3} 
        penumbra={1} 
        intensity={8} 
        castShadow 
      />
      <pointLight color="#FFB3C6" intensity={5} position={[-5, 5, 3]}/>
      <pointLight color="#FF2A6D" intensity={3} position={[0, 8, -4]}/>
      <pointLight color="#FFD700" intensity={extinguished ? 0 : 4}
        position={[0, 4.5, 0]} distance={12}/>

      {/* Shift entire cake down */}
      <group position={[0, -2.5, 0]}>
        <CakeMesh extinguished={extinguished}/>
      </group>

      <OrbitControls
        enableZoom={false} enablePan={false}
        autoRotate autoRotateSpeed={0.5}
        target={[0, 0, 0]}
        maxPolarAngle={Math.PI / 2.1}
        minPolarAngle={Math.PI / 6}
      />
    </Canvas>
  );
}