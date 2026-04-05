import { useRef, useState, useEffect } from 'react'

const MUSCLE_COLORS = {
  Chest: '#C8FF00', Back: '#00D4FF', Shoulders: '#FFB800',
  Arms: '#A855F7', Legs: '#FF3366', Core: '#FF6B35', Glutes: '#FF1493',
  'Full Body': '#00E5A0',
}

const SKETCHFAB_EMBED = 'https://sketchfab.com/models/33162ec759e04d2985dbbdf4ec908d66/embed?preload=1&ui_stop=0&ui_inspector=0&ui_infos=0&ui_watermark=0&ui_watermark_link=0&ui_hint=0&ui_ar=0&ui_vr=0&ui_fullscreen=0&ui_help=0&ui_settings=0&ui_annotations=0&transparent=1&ui_color=1C1C1E'

export default function SketchfabMuscleViewer({ selectedMuscles = [], lastSelected, className = '' }) {
  const [loaded, setLoaded] = useState(false)
  const [showLabel, setShowLabel] = useState(null)
  const timerRef = useRef(null)

  // Show the last selected muscle label for 3 seconds
  useEffect(() => {
    if (lastSelected && lastSelected.muscle) {
      setShowLabel(lastSelected.muscle)
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setShowLabel(null), 3000)
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [lastSelected])

  return (
    <div className={`relative ${className}`}>
      {/* Loading state */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface-container z-10">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-3" />
            <p className="text-on-surface-variant text-xs font-bold">Loading 3D Anatomy Model...</p>
            <p className="text-on-surface-variant/50 text-[10px] mt-1">Rotate and explore the body</p>
          </div>
        </div>
      )}

      {/* Sketchfab iframe — visual reference only */}
      <iframe
        title="Écorché Male Musclenames Anatomy"
        src={SKETCHFAB_EMBED}
        className="w-full border-0"
        style={{ height: '450px' }}
        allow="autoplay; fullscreen; xr-spatial-tracking"
        allowFullScreen
        onLoad={() => setLoaded(true)}
      />

      {/* Selected muscle label — persists for 3 seconds */}
      {showLabel && MUSCLE_COLORS[showLabel] && (
        <div
          className="absolute top-3 left-1/2 -translate-x-1/2 z-20 px-5 py-2.5 rounded-xl border shadow-xl pointer-events-none"
          style={{
            backgroundColor: `${MUSCLE_COLORS[showLabel]}18`,
            borderColor: `${MUSCLE_COLORS[showLabel]}40`,
            backdropFilter: 'blur(12px)',
            animation: 'fadeInOut 3s ease-in-out forwards',
          }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: MUSCLE_COLORS[showLabel] }} />
            <span className="text-sm font-black uppercase tracking-wider" style={{ color: MUSCLE_COLORS[showLabel] }}>
              {showLabel} Selected
            </span>
            <span className="material-symbols-outlined text-sm" style={{ color: MUSCLE_COLORS[showLabel] }}>check_circle</span>
          </div>
        </div>
      )}

      {/* Selected muscles badges at bottom */}
      {selectedMuscles.length > 0 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 pointer-events-none">
          {selectedMuscles.map(m => (
            <div
              key={m}
              className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-lg"
              style={{
                backgroundColor: `${MUSCLE_COLORS[m]}25`,
                color: MUSCLE_COLORS[m],
                border: `1px solid ${MUSCLE_COLORS[m]}40`,
                backdropFilter: 'blur(8px)',
              }}
            >
              {m}
            </div>
          ))}
        </div>
      )}

      {/* Hint when nothing selected */}
      {loaded && selectedMuscles.length === 0 && !showLabel && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 bg-surface/70 backdrop-blur-md px-4 py-2 rounded-xl border border-outline-variant/10 pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-sm">touch_app</span>
            <span className="text-[10px] font-bold text-on-surface-variant">Use buttons below to select muscles</span>
          </div>
        </div>
      )}
    </div>
  )
}
