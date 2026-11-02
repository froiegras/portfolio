import React, { useRef, useState, useCallback, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import './Room.css';

const SHOTS = {
  room: { pos: [0, 1.3, 0.35], look: [0, 1.15, -1.45] },
  monitor: { pos: [0, 1.25, -0.72], look: [0, 1.25, -1.47] },
};

function CameraRig({ entering, onArrived }) {
  const look = useRef(new THREE.Vector3(...SHOTS.room.look));
  const target = useRef(new THREE.Vector3());
  const arrived = useRef(false);

  useFrame((state, delta) => {
    const { camera, pointer } = state;
    const shot = entering ? SHOTS.monitor : SHOTS.room;
    const sway = entering ? 0 : 1;
    const speed = entering ? 2.6 : 3;

  target.current.set(
    shot.pos[0] + pointer.x * 0.15 * sway,
    shot.pos[1] + pointer.y * 0.08 * sway,
    shot.pos[2]
  );

    camera.position.x = THREE.MathUtils.damp(camera.position.x, target.current.x, speed, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, target.current.y, speed, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, target.current.z, speed, delta);

    look.current.x = THREE.MathUtils.damp(look.current.x, shot.look[0], speed, delta);
    look.current.y = THREE.MathUtils.damp(look.current.y, shot.look[1], speed, delta);
    look.current.z = THREE.MathUtils.damp(look.current.z, shot.look[2], speed, delta);
    camera.lookAt(look.current);

    if (entering && !arrived.current && camera.position.distanceTo(target.current) < 0.03) {
      arrived.current = true;
      onArrived();
    }
  });

  return null;
}

function PlaceholderRoom({ onScreenClick }) {
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => { document.body.style.cursor = 'auto'; };
  }, [hovered]);

  return (
    <group>
      {/* floor */}
      <mesh rotation-x={-Math.PI / 2}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#1f2026" />
      </mesh>

      {/* back wall */}
      <mesh position={[0, 2, -2]}>
        <planeGeometry args={[12, 4]} />
        <meshStandardMaterial color="#2a2b32" />
      </mesh>

      {/* desk */}
      <mesh position={[0, 0.75, -1.3]}>
        <boxGeometry args={[3.2, 0.08, 1.2]} />
        <meshStandardMaterial color="#4a3b30" />
      </mesh>

      {/* monitor stand */}
      <mesh position={[0, 0.85, -1.5]}>
        <boxGeometry args={[0.4, 0.12, 0.25]} />
        <meshStandardMaterial color="#101114" />
      </mesh>

      {/* monitor body */}
      <mesh position={[0, 1.25, -1.5]}>
        <boxGeometry args={[1.35, 0.8, 0.06]} />
        <meshStandardMaterial color="#101114" />
      </mesh>

      {/* NEW: PC tower on the right side of the desk */}
      <mesh position={[1.0, 1.04, -1.35]}>
        <boxGeometry args={[0.22, 0.5, 0.42]} />
        <meshStandardMaterial color="#17181c" />
      </mesh>
      <mesh position={[0.95, 1.2, -1.139]}>
        <boxGeometry args={[0.02, 0.02, 0.01]} />
        <meshBasicMaterial color="#7c8cff" toneMapped={false} />
      </mesh>

      {/* the clickable screen */}
      <mesh
        name="Screen"
        position={[0, 1.25, -1.468]}
        onClick={(e) => { e.stopPropagation(); onScreenClick(); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={() => setHovered(false)}
      >
        <planeGeometry args={[1.22, 0.68]} />
        <meshBasicMaterial color={hovered ? '#a9b4ff' : '#7c8cff'} toneMapped={false} />
      </mesh>
    </group>
  );
}

// TODO: Use this instead of PlaceholderRoom when Blender render is ready
// import { useGLTF, useProgress } from '@react-three/drei';

// function RoomModel({ onScreenClick }) {
//   const { scene } = useGLTF('/assets/room.glb');
//   const [hovered, setHovered] = useState(false);

//   useEffect(() => {
//     document.body.style.cursor = hovered ? 'pointer' : 'auto';
//     const screen = scene.getObjectByName('Screen');
//     if (screen?.material) screen.material.emissiveIntensity = hovered ? 1.6 : 1;
//     return () => { document.body.style.cursor = 'auto'; };
//   }, [hovered, scene]);

//   return (
//     <primitive
//       object={scene}
//       onClick={(e) => {
//         if (e.object.name === 'Screen') { e.stopPropagation(); onScreenClick(); }
//       }}
//       onPointerOver={(e) => {
//         if (e.object.name === 'Screen') { e.stopPropagation(); setHovered(true); }
//       }}
//       onPointerOut={() => setHovered(false)}
//     />
//   );
// }

// useGLTF.preload('/assets/room.glb');

export default function Room({ onEnter }) {
  const [entering, setEntering] = useState(false);
  const [reduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  const start = useCallback(() => {
    if (reduced) {
      onEnter();
      return;
    }
    setEntering(true);
  }, [reduced, onEnter]);

  return (
    <div className={`room${entering ? ' entering' : ''}`}>
      <div className="room-canvas" aria-hidden="true">
        <Canvas camera={{ position: SHOTS.room.pos, fov: 50 }} dpr={[1, 2]}>
          <color attach="background" args={['#0f1014']} />
          <ambientLight intensity={0.4} />
          <directionalLight position={[3, 4, 2]} intensity={0.8} />
          <pointLight position={[0, 1.25, -1]} intensity={3} distance={5} color="#7c8cff" />
          <CameraRig entering={entering} onArrived={onEnter} />
          <PlaceholderRoom onScreenClick={start} />
        </Canvas>
      </div>

      <div className="room-ui">
        <p>Click the monitor to start</p>
        <button onClick={start}>Enter the desktop</button>
      </div>
    </div>
  );
}