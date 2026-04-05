import { useRef, useState, useCallback, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

// ─── Colors ───
const MUSCLE_COLORS = {
  Chest: '#C8FF00', Back: '#00D4FF', Shoulders: '#FFB800',
  Arms: '#A855F7', Legs: '#FF3366', Core: '#FF6B35', Glutes: '#FF1493',
  'Full Body': '#00E5A0',
}
const SKIN_BASE = '#3A3A3C'
const SKIN_DARK = '#2C2C2E'

// ─── Anatomical Muscle Segment Definitions ───
// Each shape: { type, args, pos, rot, group }
// type: 'capsule' | 'cylinder' | 'box' | 'sphere' | 'torus'
const BODY_SEGMENTS = [
  // ══════════ CHEST ══════════
  // Left pec - flat, wide, fan-shaped
  { type:'box', args:[0.22, 0.18, 0.08], pos:[-0.14, 1.18, 0.16], rot:[0,0,0.08], group:'Chest' },
  // Right pec
  { type:'box', args:[0.22, 0.18, 0.08], pos:[0.14, 1.18, 0.16], rot:[0,0,-0.08], group:'Chest' },
  // Upper pec ridge L
  { type:'capsule', args:[0.04, 0.12, 6, 8], pos:[-0.14, 1.3, 0.17], rot:[0,0,0.4], group:'Chest' },
  // Upper pec ridge R
  { type:'capsule', args:[0.04, 0.12, 6, 8], pos:[0.14, 1.3, 0.17], rot:[0,0,-0.4], group:'Chest' },
  // Sternum center line
  { type:'box', args:[0.03, 0.2, 0.04], pos:[0, 1.18, 0.2], rot:[0,0,0], group:'Chest' },

  // ══════════ CORE / ABS ══════════
  // Rectus abdominis blocks (6-pack)
  { type:'box', args:[0.08, 0.06, 0.05], pos:[-0.06, 0.98, 0.17], rot:[0,0,0], group:'Core' },
  { type:'box', args:[0.08, 0.06, 0.05], pos:[0.06, 0.98, 0.17], rot:[0,0,0], group:'Core' },
  { type:'box', args:[0.08, 0.06, 0.05], pos:[-0.06, 0.88, 0.17], rot:[0,0,0], group:'Core' },
  { type:'box', args:[0.08, 0.06, 0.05], pos:[0.06, 0.88, 0.17], rot:[0,0,0], group:'Core' },
  { type:'box', args:[0.08, 0.06, 0.05], pos:[-0.06, 0.78, 0.16], rot:[0,0,0], group:'Core' },
  { type:'box', args:[0.08, 0.06, 0.05], pos:[0.06, 0.78, 0.16], rot:[0,0,0], group:'Core' },
  // Obliques L
  { type:'box', args:[0.06, 0.22, 0.08], pos:[-0.2, 0.86, 0.08], rot:[0,0,0.12], group:'Core' },
  // Obliques R
  { type:'box', args:[0.06, 0.22, 0.08], pos:[0.2, 0.86, 0.08], rot:[0,0,-0.12], group:'Core' },

  // ══════════ SHOULDERS ══════════
  // Left deltoid cap
  { type:'sphere', args:[0.08, 12, 10], pos:[-0.34, 1.34, 0], rot:[0,0,0], group:'Shoulders' },
  // Right deltoid cap
  { type:'sphere', args:[0.08, 12, 10], pos:[0.34, 1.34, 0], rot:[0,0,0], group:'Shoulders' },
  // Left front delt
  { type:'capsule', args:[0.04, 0.08, 6, 8], pos:[-0.32, 1.28, 0.06], rot:[0.4,0,0.2], group:'Shoulders' },
  // Right front delt
  { type:'capsule', args:[0.04, 0.08, 6, 8], pos:[0.32, 1.28, 0.06], rot:[0.4,0,-0.2], group:'Shoulders' },
  // Left rear delt
  { type:'capsule', args:[0.04, 0.08, 6, 8], pos:[-0.32, 1.28, -0.06], rot:[-0.4,0,0.2], group:'Shoulders' },
  // Right rear delt
  { type:'capsule', args:[0.04, 0.08, 6, 8], pos:[0.32, 1.28, -0.06], rot:[-0.4,0,-0.2], group:'Shoulders' },
  // Traps L
  { type:'capsule', args:[0.04, 0.1, 6, 8], pos:[-0.12, 1.4, -0.04], rot:[0,0,0.6], group:'Shoulders' },
  // Traps R
  { type:'capsule', args:[0.04, 0.1, 6, 8], pos:[0.12, 1.4, -0.04], rot:[0,0,-0.6], group:'Shoulders' },

  // ══════════ ARMS ══════════
  // LEFT BICEP
  { type:'capsule', args:[0.045, 0.1, 8, 8], pos:[-0.38, 1.1, 0.04], rot:[0,0,0.06], group:'Arms' },
  // RIGHT BICEP
  { type:'capsule', args:[0.045, 0.1, 8, 8], pos:[0.38, 1.1, 0.04], rot:[0,0,-0.06], group:'Arms' },
  // LEFT TRICEP (back of arm, slightly larger)
  { type:'capsule', args:[0.042, 0.11, 8, 8], pos:[-0.38, 1.08, -0.04], rot:[0,0,0.06], group:'Arms' },
  // RIGHT TRICEP
  { type:'capsule', args:[0.042, 0.11, 8, 8], pos:[0.38, 1.08, -0.04], rot:[0,0,-0.06], group:'Arms' },
  // LEFT FOREARM
  { type:'capsule', args:[0.035, 0.1, 8, 8], pos:[-0.4, 0.84, 0], rot:[0,0,0.04], group:'Arms' },
  // RIGHT FOREARM
  { type:'capsule', args:[0.035, 0.1, 8, 8], pos:[0.4, 0.84, 0], rot:[0,0,-0.04], group:'Arms' },

  // ══════════ BACK ══════════
  // Left lat spread
  { type:'box', args:[0.16, 0.22, 0.06], pos:[-0.14, 1.1, -0.16], rot:[0, 0, 0.06], group:'Back' },
  // Right lat spread
  { type:'box', args:[0.16, 0.22, 0.06], pos:[0.14, 1.1, -0.16], rot:[0, 0, -0.06], group:'Back' },
  // Lower back erectors L
  { type:'capsule', args:[0.035, 0.14, 6, 8], pos:[-0.06, 0.82, -0.15], rot:[0,0,0], group:'Back' },
  // Lower back erectors R
  { type:'capsule', args:[0.035, 0.14, 6, 8], pos:[0.06, 0.82, -0.15], rot:[0,0,0], group:'Back' },
  // Mid traps
  { type:'box', args:[0.2, 0.1, 0.05], pos:[0, 1.28, -0.14], rot:[0,0,0], group:'Back' },

  // ══════════ LEGS ══════════
  // Left quad (front of thigh)
  { type:'capsule', args:[0.065, 0.16, 8, 10], pos:[-0.13, 0.28, 0.04], rot:[0,0,0.02], group:'Legs' },
  // Right quad
  { type:'capsule', args:[0.065, 0.16, 8, 10], pos:[0.13, 0.28, 0.04], rot:[0,0,-0.02], group:'Legs' },
  // Left inner quad / adductor
  { type:'capsule', args:[0.04, 0.14, 6, 8], pos:[-0.07, 0.26, 0.02], rot:[0,0,0.1], group:'Legs' },
  // Right inner quad
  { type:'capsule', args:[0.04, 0.14, 6, 8], pos:[0.07, 0.26, 0.02], rot:[0,0,-0.1], group:'Legs' },
  // Left hamstring
  { type:'capsule', args:[0.058, 0.15, 8, 10], pos:[-0.13, 0.28, -0.04], rot:[0,0,0.02], group:'Legs' },
  // Right hamstring
  { type:'capsule', args:[0.058, 0.15, 8, 10], pos:[0.13, 0.28, -0.04], rot:[0,0,-0.02], group:'Legs' },
  // Left calf (gastrocnemius)
  { type:'capsule', args:[0.042, 0.1, 8, 8], pos:[-0.12, -0.12, -0.02], rot:[0,0,0.01], group:'Legs' },
  // Right calf
  { type:'capsule', args:[0.042, 0.1, 8, 8], pos:[0.12, -0.12, -0.02], rot:[0,0,-0.01], group:'Legs' },
  // Left tibialis (front shin)
  { type:'capsule', args:[0.03, 0.1, 6, 8], pos:[-0.11, -0.12, 0.03], rot:[0,0,0.01], group:'Legs' },
  // Right tibialis
  { type:'capsule', args:[0.03, 0.1, 6, 8], pos:[0.11, -0.12, 0.03], rot:[0,0,-0.01], group:'Legs' },

  // ══════════ GLUTES ══════════
  // Left glute
  { type:'sphere', args:[0.1, 12, 10], pos:[-0.11, 0.5, -0.1], rot:[0,0,0], group:'Glutes' },
  // Right glute
  { type:'sphere', args:[0.1, 12, 10], pos:[0.11, 0.5, -0.1], rot:[0,0,0], group:'Glutes' },
]

// ═══ Geometry factory ═══
function getGeometry(type, args) {
  switch (type) {
    case 'capsule': return <capsuleGeometry args={args} />
    case 'cylinder': return <cylinderGeometry args={args} />
    case 'box': return <boxGeometry args={args} />
    case 'sphere': return <sphereGeometry args={args} />
    case 'torus': return <torusGeometry args={args} />
    default: return <boxGeometry args={args} />
  }
}

// ─── Single Muscle Segment ───
function MuscleMesh({ type, args, position, rotation, group, isSelected, isHovered, onClick, onHover }) {
  const ref = useRef()

  const color = isSelected ? MUSCLE_COLORS[group] : isHovered ? '#FF9F0A' : SKIN_BASE
  const emissive = isSelected ? MUSCLE_COLORS[group] : isHovered ? '#FF9F0A' : '#000000'
  const emissiveIntensity = isSelected ? 0.5 : isHovered ? 0.25 : 0

  // Subtle pulse for selected segments
  useFrame((_, dt) => {
    if (ref.current && isSelected) {
      ref.current.material.emissiveIntensity = 0.35 + Math.sin(Date.now() * 0.003) * 0.15
    }
  })

  return (
    <mesh
      ref={ref}
      position={position}
      rotation={rotation}
      onClick={(e) => { e.stopPropagation(); onClick(group) }}
      onPointerOver={(e) => { e.stopPropagation(); onHover(group) }}
      onPointerOut={(e) => { e.stopPropagation(); onHover(null) }}
      castShadow
    >
      {getGeometry(type, args)}
      <meshPhysicalMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
        roughness={0.45}
        metalness={0.05}
        clearcoat={0.15}
        clearcoatRoughness={0.4}
        transparent
        opacity={isSelected ? 1 : 0.88}
      />
    </mesh>
  )
}

// ─── Anatomical skeleton wireframe ───
function Skeleton() {
  const mat = useMemo(() => new THREE.MeshStandardMaterial({
    color: SKIN_DARK, roughness: 0.9, metalness: 0, transparent: true, opacity: 0.18
  }), [])

  return (
    <group>
      {/* Head */}
      <mesh position={[0, 1.56, 0]} material={mat}><sphereGeometry args={[0.1, 14, 10]} /></mesh>
      {/* Neck */}
      <mesh position={[0, 1.44, 0]} material={mat}><cylinderGeometry args={[0.045, 0.055, 0.06, 8]} /></mesh>
      {/* Rib cage */}
      <mesh position={[0, 1.12, 0]} material={mat}><cylinderGeometry args={[0.18, 0.22, 0.4, 12]} /></mesh>
      {/* Waist */}
      <mesh position={[0, 0.86, 0]} material={mat}><cylinderGeometry args={[0.16, 0.18, 0.18, 10]} /></mesh>
      {/* Pelvis */}
      <mesh position={[0, 0.55, 0]} material={mat}><cylinderGeometry args={[0.2, 0.14, 0.22, 10]} /></mesh>
      {/* Left upper arm */}
      <mesh position={[-0.38, 1.1, 0]} rotation={[0, 0, 0.06]} material={mat}><cylinderGeometry args={[0.032, 0.04, 0.32, 8]} /></mesh>
      {/* Right upper arm */}
      <mesh position={[0.38, 1.1, 0]} rotation={[0, 0, -0.06]} material={mat}><cylinderGeometry args={[0.032, 0.04, 0.32, 8]} /></mesh>
      {/* Left forearm */}
      <mesh position={[-0.4, 0.84, 0]} material={mat}><cylinderGeometry args={[0.025, 0.032, 0.24, 8]} /></mesh>
      {/* Right forearm */}
      <mesh position={[0.4, 0.84, 0]} material={mat}><cylinderGeometry args={[0.025, 0.032, 0.24, 8]} /></mesh>
      {/* Left thigh */}
      <mesh position={[-0.12, 0.28, 0]} rotation={[0, 0, 0.02]} material={mat}><cylinderGeometry args={[0.055, 0.07, 0.42, 8]} /></mesh>
      {/* Right thigh */}
      <mesh position={[0.12, 0.28, 0]} rotation={[0, 0, -0.02]} material={mat}><cylinderGeometry args={[0.055, 0.07, 0.42, 8]} /></mesh>
      {/* Left shin */}
      <mesh position={[-0.12, -0.12, 0]} material={mat}><cylinderGeometry args={[0.035, 0.048, 0.38, 8]} /></mesh>
      {/* Right shin */}
      <mesh position={[0.12, -0.12, 0]} material={mat}><cylinderGeometry args={[0.035, 0.048, 0.38, 8]} /></mesh>
      {/* Left foot */}
      <mesh position={[-0.12, -0.34, 0.03]} material={mat}><boxGeometry args={[0.06, 0.03, 0.1]} /></mesh>
      {/* Right foot */}
      <mesh position={[0.12, -0.34, 0.03]} material={mat}><boxGeometry args={[0.06, 0.03, 0.1]} /></mesh>
    </group>
  )
}

// ─── Center-line marking ───
function Centerline() {
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ color: '#1C1C1E', transparent: true, opacity: 0.3 }), [])
  return (
    <group>
      {/* Linea alba (center line down front) */}
      <mesh position={[0, 0.9, 0.19]} material={mat}><boxGeometry args={[0.008, 0.45, 0.005]} /></mesh>
      {/* Spine line */}
      <mesh position={[0, 1.0, -0.17]} material={mat}><boxGeometry args={[0.008, 0.6, 0.005]} /></mesh>
    </group>
  )
}

// ─── Auto-rotate ───
function AutoRotate({ children, speed = 0.25 }) {
  const ref = useRef()
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.y += dt * speed })
  return <group ref={ref}>{children}</group>
}

// ─── Scene ───
function MuscleScene({ selectedMuscles, onToggle, hoveredMuscle, setHoveredMuscle, autoRotate }) {
  const { gl } = useThree()

  const handleHover = useCallback((group) => {
    setHoveredMuscle(group)
    gl.domElement.style.cursor = group ? 'pointer' : 'auto'
  }, [gl, setHoveredMuscle])

  const body = (
    <group position={[0, -0.45, 0]}>
      <Skeleton />
      <Centerline />
      {BODY_SEGMENTS.map((seg, i) => (
        <MuscleMesh
          key={i}
          type={seg.type}
          args={seg.args}
          position={seg.pos}
          rotation={seg.rot || [0, 0, 0]}
          group={seg.group}
          isSelected={selectedMuscles.includes(seg.group)}
          isHovered={hoveredMuscle === seg.group}
          onClick={onToggle}
          onHover={handleHover}
        />
      ))}
    </group>
  )

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 4]} intensity={0.9} castShadow />
      <directionalLight position={[-3, 3, -2]} intensity={0.3} />
      <pointLight position={[0, 2, 3]} intensity={0.3} color="#C8FF00" distance={6} />
      <pointLight position={[0, 0, -3]} intensity={0.2} color="#0A84FF" distance={5} />

      {autoRotate ? <AutoRotate>{body}</AutoRotate> : body}

      <ContactShadows position={[0, -0.95, 0]} opacity={0.25} scale={3} blur={3} far={2} />
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={1.2}
        maxDistance={4}
        minPolarAngle={Math.PI * 0.15}
        maxPolarAngle={Math.PI * 0.85}
        target={[0, 0.15, 0]}
      />
    </>
  )
}

// ─── Main Component ───
export default function MuscleModel3D({ selectedMuscles = [], onToggleMuscle, className = '' }) {
  const [hoveredMuscle, setHoveredMuscle] = useState(null)
  const [autoRotate, setAutoRotate] = useState(true)

  return (
    <div className={`relative ${className}`}>
      <Canvas
        camera={{ position: [0, 0.4, 2.2], fov: 38 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
        onPointerDown={() => setAutoRotate(false)}
      >
        <MuscleScene
          selectedMuscles={selectedMuscles}
          onToggle={onToggleMuscle}
          hoveredMuscle={hoveredMuscle}
          setHoveredMuscle={setHoveredMuscle}
          autoRotate={autoRotate}
        />
      </Canvas>

      {/* Hover label */}
      {hoveredMuscle && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-surface/90 backdrop-blur-md px-4 py-2 rounded-xl border border-outline-variant/20 pointer-events-none shadow-lg">
          <span className="text-xs font-black uppercase tracking-wider" style={{ color: MUSCLE_COLORS[hoveredMuscle] }}>
            {hoveredMuscle}
          </span>
        </div>
      )}

      {/* Selection count */}
      {selectedMuscles.length > 0 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-primary/90 backdrop-blur-md px-4 py-2 rounded-xl pointer-events-none shadow-lg">
          <span className="text-xs font-bold text-white">
            {selectedMuscles.length} muscle{selectedMuscles.length > 1 ? 's' : ''} selected
          </span>
        </div>
      )}

      {/* Controls */}
      <button
        onClick={() => setAutoRotate(true)}
        className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-surface/70 backdrop-blur-md border border-outline-variant/20 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
        title="Auto-rotate"
      >
        <span className="material-symbols-outlined text-sm">360</span>
      </button>
    </div>
  )
}
