import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const MUSCLE_COLORS = {
  Chest: '#C8FF00', Back: '#00D4FF', Shoulders: '#FFB800',
  Arms: '#A855F7', Legs: '#FF3366', Core: '#FF6B35', Glutes: '#FF1493',
  'Full Body': '#00E5A0',
}

/*
 * Hotspot positions calibrated to the generated anatomy images.
 * Body centered ~25%-75% horizontally, ~5%-95% vertically.
 * Coordinates: { x%, y%, w%, h% } relative to image container.
 */

// FRONT VIEW — calibrated from body_front image
const FRONT_HOTSPOTS = {
  Shoulders: [
    { x: 25, y: 12, w: 10, h: 7 },   // Left delt
    { x: 65, y: 12, w: 10, h: 7 },   // Right delt
  ],
  Chest: [
    { x: 32, y: 16, w: 16, h: 10 },  // Left pec
    { x: 52, y: 16, w: 16, h: 10 },  // Right pec
  ],
  Arms: [
    { x: 22, y: 20, w: 8, h: 14 },   // Left bicep
    { x: 70, y: 20, w: 8, h: 14 },   // Right bicep
    { x: 19, y: 35, w: 7, h: 14 },   // Left forearm
    { x: 74, y: 35, w: 7, h: 14 },   // Right forearm
  ],
  Core: [
    { x: 37, y: 27, w: 26, h: 17 },  // Abs + obliques
  ],
  Legs: [
    { x: 33, y: 47, w: 13, h: 20 },  // Left quad
    { x: 54, y: 47, w: 13, h: 20 },  // Right quad
    { x: 35, y: 69, w: 10, h: 18 },  // Left shin/calf front
    { x: 55, y: 69, w: 10, h: 18 },  // Right shin/calf front
  ],
}

// BACK VIEW — calibrated from body_back image
const BACK_HOTSPOTS = {
  Shoulders: [
    { x: 26, y: 13, w: 12, h: 8 },   // Left rear delt + trap
    { x: 62, y: 13, w: 12, h: 8 },   // Right rear delt + trap
  ],
  Back: [
    { x: 33, y: 17, w: 14, h: 20 },  // Left lat
    { x: 53, y: 17, w: 14, h: 20 },  // Right lat
    { x: 38, y: 38, w: 24, h: 8 },   // Lower back
  ],
  Arms: [
    { x: 22, y: 20, w: 8, h: 14 },   // Left tricep
    { x: 70, y: 20, w: 8, h: 14 },   // Right tricep
    { x: 19, y: 35, w: 7, h: 13 },   // Left forearm
    { x: 74, y: 35, w: 7, h: 13 },   // Right forearm
  ],
  Glutes: [
    { x: 36, y: 45, w: 12, h: 10 },  // Left glute
    { x: 52, y: 45, w: 12, h: 10 },  // Right glute
  ],
  Legs: [
    { x: 33, y: 53, w: 13, h: 16 },  // Left hamstring
    { x: 54, y: 53, w: 13, h: 16 },  // Right hamstring
    { x: 35, y: 71, w: 10, h: 16 },  // Left calf
    { x: 55, y: 71, w: 10, h: 16 },  // Right calf
  ],
}

function Hotspot({ x, y, w, h, group, isSelected, isHovered, onClick, onHover }) {
  const color = MUSCLE_COLORS[group] || '#C8FF00'
  const active = isSelected || isHovered

  return (
    <div
      onClick={(e) => { e.stopPropagation(); onClick(group) }}
      onMouseEnter={() => onHover(group)}
      onMouseLeave={() => onHover(null)}
      className="absolute transition-all duration-200 cursor-pointer"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${w}%`,
        height: `${h}%`,
        backgroundColor: active ? color : 'transparent',
        opacity: isSelected ? 0.4 : isHovered ? 0.25 : 0,
        borderRadius: '8px',
        border: active ? `2px solid ${color}` : '2px solid transparent',
        boxShadow: isSelected ? `0 0 20px ${color}60, inset 0 0 15px ${color}30` : 'none',
      }}
    />
  )
}

export default function InteractiveBodyMap({ selectedMuscles = [], onToggleMuscle, className = '' }) {
  const [hoveredMuscle, setHoveredMuscle] = useState(null)
  const [view, setView] = useState('front')

  const handleHover = useCallback((group) => setHoveredMuscle(group), [])
  const hotspots = view === 'front' ? FRONT_HOTSPOTS : BACK_HOTSPOTS

  return (
    <div className={`relative ${className}`}>
      {/* View toggle */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex bg-surface/80 backdrop-blur-md rounded-xl border border-outline-variant/20 overflow-hidden shadow-lg">
        <button
          onClick={() => setView('front')}
          className={`px-5 py-2 text-[10px] font-black uppercase tracking-wider transition-all ${
            view === 'front' ? 'bg-primary text-white shadow-inner' : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          Front
        </button>
        <button
          onClick={() => setView('back')}
          className={`px-5 py-2 text-[10px] font-black uppercase tracking-wider transition-all ${
            view === 'back' ? 'bg-primary text-white shadow-inner' : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          Back
        </button>
      </div>

      {/* Anatomy Image + Hotspot Overlay */}
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          className="relative"
        >
          {/* Anatomy illustration */}
          <img
            src={view === 'front' ? '/body-front.png' : '/body-back.png'}
            alt={`${view} body view`}
            className="w-full h-auto pointer-events-none select-none"
            draggable={false}
          />

          {/* Clickable hotspot overlays */}
          {Object.entries(hotspots).map(([group, zones]) =>
            zones.map((zone, i) => (
              <Hotspot
                key={`${view}-${group}-${i}`}
                {...zone}
                group={group}
                isSelected={selectedMuscles.includes(group)}
                isHovered={hoveredMuscle === group}
                onClick={onToggleMuscle}
                onHover={handleHover}
              />
            ))
          )}
        </motion.div>
      </AnimatePresence>

      {/* Hover label */}
      {hoveredMuscle && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-surface/90 backdrop-blur-md px-4 py-2 rounded-xl border border-outline-variant/20 pointer-events-none shadow-lg z-20">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: MUSCLE_COLORS[hoveredMuscle] }} />
            <span className="text-xs font-black uppercase tracking-wider" style={{ color: MUSCLE_COLORS[hoveredMuscle] }}>
              {hoveredMuscle}
            </span>
          </div>
        </div>
      )}

      {/* Selection count badge */}
      {selectedMuscles.length > 0 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-primary/90 backdrop-blur-md px-4 py-2 rounded-xl pointer-events-none shadow-lg z-20">
          <span className="text-xs font-bold text-white">
            {selectedMuscles.length} muscle{selectedMuscles.length > 1 ? 's' : ''} selected
          </span>
        </div>
      )}

      {/* View label */}
      <div className="absolute bottom-3 right-3 z-10">
        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-on-surface-variant/30">
          {view === 'front' ? 'ANTERIOR' : 'POSTERIOR'}
        </span>
      </div>
    </div>
  )
}
