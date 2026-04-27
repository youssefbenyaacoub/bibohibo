import { Canvas } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import { useSpring, animated as Animated } from '@react-spring/three';
import { useState, Suspense } from 'react';
import * as THREE from 'three';

function GiftMesh({ onOpen }) {
  const [opened, setOpened] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Load Minecraft texture
  const texture = useTexture('/minecraft_gift_texture.png');
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;

  const { lidRot, scale } = useSpring({
    lidRot: opened ? -Math.PI / 2 : 0,
    scale: hovered ? 1.05 : 1.0,
    config: { tension: 150, friction: 20 }
  });

  // Minecraft Chest Proportions (scaled to approx 2 units)
  const W = 1.8;
  const D = 1.8;
  const BODY_H = 1.2;
  const LID_H = 0.6;

  return (
    <Animated.group scale={scale}>
      {/* Box body */}
      <mesh
        position={[0, BODY_H / 2 - 1, 0]}
        onClick={() => { 
          if(!opened){ 
            setOpened(true); 
            onOpen && onOpen(); 
          }
        }}
        onPointerEnter={() => { setHovered(true); document.body.style.cursor='pointer'; }}
        onPointerLeave={() => { setHovered(false); document.body.style.cursor='default'; }}
      >
        <boxGeometry args={[W, BODY_H, D]} />
        <meshStandardMaterial map={texture} roughness={1} metalness={0} />
      </mesh>

      {/* Lid Group - Pivot at the top-back edge */}
      <Animated.group 
        position={[0, BODY_H - 1, -D / 2]} 
        rotation-x={lidRot}
      >
        {/* Lid Mesh - offset so it sits properly when rotation is 0 */}
        <mesh position={[0, LID_H / 2, D / 2]}>
          <boxGeometry args={[W + 0.1, LID_H, D + 0.1]} />
          <meshStandardMaterial map={texture} roughness={1} metalness={0} />
        </mesh>
        
        {/* Latch (The white handle on a Minecraft chest) */}
        <mesh position={[0, LID_H / 2 - 0.2, D + 0.06]}>
          <boxGeometry args={[0.2, 0.4, 0.1]} />
          <meshStandardMaterial color="white" />
        </mesh>
      </Animated.group>

      {/* Inner glow when opened */}
      {opened && (
        <pointLight color="#FFD700" intensity={10} distance={4} position={[0, 0, 0]}/>
      )}

      {/* Ground shadow */}
      <mesh position={[0, -1.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.5, 2.5]}/>
        <meshBasicMaterial color="#000000" transparent opacity={0.3}/>
      </mesh>
    </Animated.group>
  );
}

export default function GiftBox3D({ onOpen }) {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 1, 5], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={1.5}/>
          <spotLight position={[5, 5, 5]} intensity={2} angle={0.15} penumbra={1}/>
          <pointLight position={[-5, 5, -5]} intensity={1}/>
          
          <GiftMesh onOpen={onOpen}/>

          <OrbitControls
            enableZoom={false} enablePan={false}
            autoRotate={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 4}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}