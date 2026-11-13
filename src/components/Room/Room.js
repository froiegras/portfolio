import React, { Suspense, useMemo, useRef, useState, useCallback, useEffect } from 'react';
import { useGLTF, useProgress, OrbitControls, useHelper } from '@react-three/drei';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import './Room.css';

const SHOTS = {
  room: { pos: [-0.07, 1.27, 2.65], look: [0, 1.15, -1.45] },
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
const TABLE_URL = '/assets/room/table.glb';
const MONITOR_URL = '/assets/room/monitor.glb';

const SHELF = { enabled: true, height: 0.05, width: 1.2, depth: 0.5, color: '#3a2f27' };
const WALL_SHELF = {
  enabled: true,
  width: 1.2,
  depth: 0.2,
  thickness: 0.03,
  clearance: 0.5,
  nudgeX: 0,
  color: '#4a3b30',
};
const MONITOR_NUDGE = { x: 0, z: 0 };
const MONITOR_SCALE = 1;
const MONITOR_TURN = 4.75;
const TABLE_ROT = [0, 1.57, Math.PI];
const BACK_GAP = 0;
const WALL_GAP = 0;
const MONITOR_LIFT = 0.0001;
const SHELF_LIFT = 0.2;
const LAMP = {
  color: '#ffe2b8',    // warm white
  night: 1.4,          // brightness at night
  day: 0.3,            // brightness in the day, and 0 turns it off
  rise: 0.5,           // meters above the top of the monitor
  forward: 0.3,        // meters in front of the screen (toward the camera)
  angle: 0.6,          // half-width of the cone, in radians
  penumbra: 0.9,       // 0 = hard edge, 1 = very soft
  visible: true,       // draw a small lamp bar, so the light has a visible source
};

const SHELF_BOOKS = [
  [-0.45, 0.22, 0.045, '#7c8cff'],
  [-0.4, 0.18, 0.04, '#c26d6d'],
  [-0.355, 0.2, 0.035, '#6dab8c'],
  [-0.31, 0.15, 0.04, '#d9b26b'],
];

const round2 = (n) => Math.round(n * 100) / 100;
const fmt = (v) => v.toArray().map(round2);

function MonitorLight({ pos, aim, day, debug }) {
  const light = useRef(null);
  const target = useMemo(() => new THREE.Object3D(), []);
  const mix = useRef(day);
  const [ax, ay, az] = aim;

  // the light needs a target object in the scene to aim at
  useEffect(() => {
    target.position.set(ax, ay, az);
    target.updateMatrixWorld();
    if (light.current) light.current.target = target;
  }, [target, ax, ay, az]);

  // eases between the day and night brightness
  useFrame((_, delta) => {
    mix.current = THREE.MathUtils.damp(mix.current, day, 2.5, delta);
    if (light.current) {
      light.current.intensity = THREE.MathUtils.lerp(LAMP.night, LAMP.day, mix.current);
    }
  });

  // debug only: a yellow cone shows where it points
  useHelper(debug ? light : undefined, THREE.SpotLightHelper, '#ffcc00');

  return (
    <>
      <primitive object={target} />
      <spotLight
        ref={light}
        position={pos}
        color={LAMP.color}
        angle={LAMP.angle}
        penumbra={LAMP.penumbra}
        decay={2}
        distance={0}
      />
      {LAMP.visible && (
        <mesh position={pos}>
          <boxGeometry args={[0.4, 0.02, 0.05]} />
          <meshBasicMaterial color={LAMP.color} toneMapped={false} />
        </mesh>
      )}
    </>
  );
}

function WallShelf({ position }) {
  const { width, depth, thickness, color } = WALL_SHELF;

  return (
    <group position={position}>
      {/* the board */}
      <mesh>
        <boxGeometry args={[width, thickness, depth]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>

      {/* two brackets under it */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * (width / 2 - 0.1), -(thickness / 2 + 0.05), -0.02]}>
          <boxGeometry args={[0.025, 0.1, depth - 0.04]} />
          <meshStandardMaterial color="#101114" />
        </mesh>
      ))}

      {/* books standing on it */}
      {SHELF_BOOKS.map(([bx, h, w, c]) => (
        <mesh key={bx} position={[bx, thickness / 2 + h / 2, 0]}>
          <boxGeometry args={[w, h, depth - 0.06]} />
          <meshStandardMaterial color={c} />
        </mesh>
      ))}

      {/* a small plant */}
      <mesh position={[0.4, thickness / 2 + 0.04, 0]}>
        <cylinderGeometry args={[0.05, 0.04, 0.08, 16]} />
        <meshStandardMaterial color="#b5654a" />
      </mesh>
      <mesh position={[0.4, thickness / 2 + 0.13, 0]}>
        <sphereGeometry args={[0.07, 16, 12]} />
        <meshStandardMaterial color="#4f8a5b" />
      </mesh>
    </group>
  );
}

function measure(object) {
  const box = new THREE.Box3().setFromObject(object);
  return {
    box,
    size: box.getSize(new THREE.Vector3()),
    center: box.getCenter(new THREE.Vector3()),
  };
}

function findByPrefix(root, pattern) {
  let found = null;
  root.traverse((o) => {
    if (!found && pattern.test(o.name)) found = o;
  });
  return found;
}

function DebugControls() {
  const ref = useRef(null);
  return (
    <OrbitControls
      ref={ref}
      makeDefault
      target={SHOTS.room.look}
      onEnd={() => {
        const c = ref.current;
        console.log(`room: { pos: [${fmt(c.object.position)}], look: [${fmt(c.target)}] },`);
      }}
    />
  );
}

function RoomScene({ onScreenClick, debug }) {
  const table = useGLTF(TABLE_URL).scene;
  const monitor = useGLTF(MONITOR_URL).scene;
  const screen = useMemo(() => findByPrefix(monitor, /^screen/i), [monitor]);
  const [hovered, setHovered] = useState(false);

  // measured once per model, using clones so the result ignores wherever the monitor is currently placed
  const sizes = useMemo(() => {
    table.rotation.set(...TABLE_ROT);

    const sized = monitor.clone();
    sized.scale.setScalar(MONITOR_SCALE);       // measured at its final size...

    const turned = sized.clone();
    turned.rotation.y = MONITOR_TURN;           // ...and in the orientation it will actually sit

    return { t: measure(table), m: measure(sized), footprint: measure(turned).size };
  }, [table, monitor]);

  // placement is plain arithmetic, so it runs on every render and always follows the constants
  const { t, m, footprint } = sizes;
  const shelfH = SHELF.enabled ? SHELF.height : 0;
  const rearDepth = Math.max(footprint.z, SHELF.enabled ? SHELF.depth : 0);
  const shelfBottom = t.box.max.y + SHELF_LIFT;

  const x = t.center.x + MONITOR_NUDGE.x;
  const z = t.box.min.z + BACK_GAP + rearDepth / 2 + MONITOR_NUDGE.z;
  const floorY = t.box.min.y;
  const wallZ = t.box.min.z - WALL_GAP;
  const shelfY = shelfBottom + shelfH / 2;
  const monitorBase = shelfBottom + shelfH + MONITOR_LIFT;

  // the wall shelf above the monitor
  const monitorTop = monitorBase + m.size.y;
  const wallShelfPos = [
    x + WALL_SHELF.nudgeX,
    monitorTop + WALL_SHELF.clearance + WALL_SHELF.thickness / 2,     // the board's centre
    wallZ + WALL_SHELF.depth / 2 + 0.005,                             // flat against the wall, 5 mm off it
  ];

  // const { t, m, x, z, floorY, wallZ, shelfY, monitorBase } = layout;
  // the click target is the Screen mesh, or the whole monitor if there isn't one
  const isScreen = (e) => !screen || /^screen/i.test(e.object.name);

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => { document.body.style.cursor = 'auto'; };
  }, [hovered]);

  useEffect(() => {
    const mat = screen?.material;
    if (!mat || !('emissiveIntensity' in mat)) return undefined;
    const base = mat.emissiveIntensity;
    mat.emissiveIntensity = hovered ? base * 1.6 : base;
    return () => { mat.emissiveIntensity = base; };
  }, [hovered, screen]);

  useEffect(() => {
    if (!debug) return;
    console.log('table   size', fmt(t.size), 'min', fmt(t.box.min), 'max', fmt(t.box.max));
    console.log('monitor size', fmt(m.size), 'min', fmt(m.box.min), 'max', fmt(m.box.max));
    console.log(screen ? `Screen mesh found: "${screen.name}"` : 'No Screen mesh: any click on the monitor will enter');

    const focus = screen || monitor;
    focus.updateWorldMatrix(true, true);
    const fb = new THREE.Box3().setFromObject(focus);
    const c = fb.getCenter(new THREE.Vector3());
    const s = fb.getSize(new THREE.Vector3());
    const dist = (s.y / 2) / Math.tan(THREE.MathUtils.degToRad(25)) * 1.1;   // 25 = half of the camera's fov of 50
    console.log(`monitor: { pos: [${round2(c.x)}, ${round2(c.y)}, ${round2(c.z + dist)}], look: [${round2(c.x)}, ${round2(c.y)}, ${round2(c.z)}] },`);
  }, [debug, t, m, screen, monitor]);

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[t.center.x, floorY, t.center.z]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#1f2026" />
      </mesh>
      <mesh position={[t.center.x, floorY + 2, wallZ]}>
        <planeGeometry args={[14, 4]} />
        <meshStandardMaterial color={debug ? '#4a5a7a' : '#2a2b32'} side={THREE.DoubleSide} />
      </mesh>

      <primitive object={table} />

      {SHELF.enabled && (
        <mesh position={[x, shelfY, z]}>
          <boxGeometry args={[SHELF.width, SHELF.height, SHELF.depth]} />
          <meshStandardMaterial color={SHELF.color} roughness={0.8} />
        </mesh>
      )}
      {WALL_SHELF.enabled && <WallShelf position={wallShelfPos} />}

      <group
        position={[x, monitorBase, z]}
        rotation-y={MONITOR_TURN}
        onClick={(e) => { if (isScreen(e)) { e.stopPropagation(); onScreenClick(); } }}
        onPointerOver={(e) => { if (isScreen(e)) { e.stopPropagation(); setHovered(true); } }}
        onPointerOut={() => setHovered(false)}
      >
        <group position={[-m.center.x, -m.box.min.y, -m.center.z]}>
          <group scale={MONITOR_SCALE}>
            <primitive object={monitor} />
          </group>
        </group>
      </group>
        <MonitorLight
          debug={debug}
          day={0}
          pos={[x, monitorBase + m.size.y + LAMP.rise, z + LAMP.forward]}
          aim={[x, monitorBase + m.size.y / 2, z]}
        />
    </group>
  );
}

useGLTF.preload(TABLE_URL);
useGLTF.preload(MONITOR_URL);

function Loader() {
  const { active, progress } = useProgress();
  if (!active) return null;
  return <div className="room-loader">Loading room… {Math.round(progress)}%</div>;
}

class RoomBoundary extends React.Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.warn('3D room failed to load:', error);
    this.props.onFail?.();
  }

  render() {
    return this.state.failed ? this.props.fallback ?? null : this.props.children;
  }
}

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

  const [debug] = useState(() => new URLSearchParams(window.location.search).has('debug'));

  return (
    <div className={`room${entering ? ' entering' : ''}`}>
      <RoomBoundary
        onFail={debug ? undefined : onEnter}
        fallback={<p className="room-error">Couldn't load the room. Check the console.</p>}
      >
        <div className="room-canvas" aria-hidden="true">
          <Canvas camera={{ position: SHOTS.room.pos, fov: 50 }} dpr={[1, 2]}>
            <color attach="background" args={['#0f1014']} />
            <ambientLight intensity={0.9} />
            <directionalLight position={[1, 1, 3]} intensity={1} />
            {debug ? <DebugControls /> : <CameraRig entering={entering} onArrived={onEnter} />}

            <Suspense fallback={null}>
              <RoomScene debug={debug} onScreenClick={debug ? () => console.log('Screen clicked') : start} />
            </Suspense>
          </Canvas>
        </div>
      </RoomBoundary>

      <Loader />
      <div className="room-ui">
        <p>Click the monitor to start</p>
        <button onClick={start}>Enter the desktop</button>
      </div>
    </div>
  );
}