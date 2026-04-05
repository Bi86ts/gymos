import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import muscleGroupMap from '../../data/muscleGroupMap'
import { getExercisesByMuscle } from '../../data/exerciseData'
import SketchfabMuscleViewer from '../../components/SketchfabMuscleViewer'
import GlowOrbs from '../../components/effects/GlowOrbs'
import ScrollReveal from '../../components/effects/ScrollReveal'

const MUSCLE_COLORS = {
  Chest: '#C8FF00', Back: '#00D4FF', Shoulders: '#FFB800',
  Arms: '#A855F7', Legs: '#FF3366', Core: '#FF6B35', Glutes: '#FF1493',
  'Full Body': '#00E5A0',
}

export default function MuscleSelector() {
  const navigate = useNavigate()
  const [selectedMuscles, setSelectedMuscles] = useState([])
  const [lastSelected, setLastSelected] = useState(null)

  const toggleMuscle = useCallback((muscle) => {
    setSelectedMuscles(prev => {
      const isRemoving = prev.includes(muscle)
      if (!isRemoving) setLastSelected({ muscle, ts: Date.now() })
      return isRemoving ? prev.filter(m => m !== muscle) : [...prev, muscle]
    })
  }, [])

  const handleGenerate = useCallback(() => {
    if (selectedMuscles.length > 0) {
      navigate(`/member/workout-plan?muscle=${encodeURIComponent(selectedMuscles.join(','))}`)
    }
  }, [selectedMuscles, navigate])

  const clearAll = () => setSelectedMuscles([])
  const groups = Object.entries(muscleGroupMap)
  const previewExercises = selectedMuscles.flatMap(m => getExercisesByMuscle(m).slice(0, 2))

  return (
    <div className="space-y-6 pb-8 relative">
      <GlowOrbs variant="hero" />

      {/* Header */}
      <ScrollReveal direction="up">
        <div className="text-center">
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em] mb-2 inline-block">AI-POWERED</span>
          <h1 className="font-headline text-3xl font-black text-on-surface uppercase italic leading-tight">Muscle<br/>Targeting</h1>
          <p className="text-on-surface-variant text-sm mt-2 max-w-xs mx-auto">
            Click muscles on the 3D model or use the buttons below. Multi-select supported.
          </p>
        </div>
      </ScrollReveal>

      {/* Sketchfab 3D Anatomy Model */}
      <ScrollReveal direction="up" delay={0.1}>
        <div className="rounded-2xl overflow-hidden border border-outline-variant/10 shadow-2xl bg-surface-container">
          <SketchfabMuscleViewer
            selectedMuscles={selectedMuscles}
            lastSelected={lastSelected}
          />
        </div>
      </ScrollReveal>

      {/* Quick Select Buttons — synced with 3D model */}
      <ScrollReveal direction="up" delay={0.15}>
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest">Quick Select</p>
            {selectedMuscles.length > 0 && (
              <button onClick={clearAll} className="text-[9px] font-bold text-primary uppercase tracking-wider hover:underline">
                Clear All
              </button>
            )}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {groups.map(([name, data]) => {
              const isSelected = selectedMuscles.includes(name)
              return (
                <button
                  key={name}
                  onClick={() => toggleMuscle(name)}
                  className={`relative flex flex-col items-center p-3 rounded-xl border transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-primary/15 border-primary/40 shadow-md shadow-primary/10'
                      : 'bg-surface-container border-outline-variant/10 hover:border-primary/30'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: MUSCLE_COLORS[name] }}>
                        <span className="material-symbols-outlined text-white text-[10px]">check</span>
                      </div>
                    </div>
                  )}
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-1.5"
                    style={{ backgroundColor: `${MUSCLE_COLORS[name]}${isSelected ? '30' : '15'}` }}>
                    <span className="material-symbols-outlined text-sm" style={{ color: MUSCLE_COLORS[name] }}>{data.icon}</span>
                  </div>
                  <span className={`text-[10px] font-bold ${isSelected ? 'text-on-surface' : 'text-on-surface-variant'}`}>{name}</span>
                  <span className="text-[8px] text-on-surface-variant/50 mt-0.5">{data.exerciseIds.length} ex.</span>
                </button>
              )
            })}
          </div>
        </div>
      </ScrollReveal>

      {/* Selected Muscles Preview + Generate */}
      <AnimatePresence>
        {selectedMuscles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="bg-gradient-to-br from-surface-container to-surface-container-high rounded-2xl border border-primary/20 shadow-xl overflow-hidden"
          >
            {/* Selected tags */}
            <div className="p-4 pb-2">
              <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest mb-2">Selected Muscles</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedMuscles.map(m => (
                  <button
                    key={m}
                    onClick={() => toggleMuscle(m)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: `${MUSCLE_COLORS[m]}20`, color: MUSCLE_COLORS[m] }}
                  >
                    {m}
                    <span className="material-symbols-outlined text-[10px]">close</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Exercise preview strip */}
            {previewExercises.length > 0 && (
              <div className="px-4 py-2">
                <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest mb-2">Preview</p>
                <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                  {previewExercises.slice(0, 8).map(ex => (
                    <div key={ex.id} className="shrink-0 w-20">
                      <div className="w-20 h-16 rounded-lg overflow-hidden bg-surface-container-highest mb-1">
                        <img src={ex.gifUrl} alt={ex.name} loading="lazy" className="w-full h-full object-cover" />
                      </div>
                      <p className="text-[8px] text-on-surface-variant font-bold truncate">{ex.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Generate CTA */}
            <div className="p-4 pt-2 flex gap-3">
              <button
                onClick={handleGenerate}
                className="flex-1 bg-gradient-to-r from-primary to-primary-container text-on-primary-fixed font-black py-3.5 rounded-xl text-sm shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>bolt</span>
                Generate AI Workout ({selectedMuscles.length} muscle{selectedMuscles.length > 1 ? 's' : ''})
              </button>
              <button
                onClick={() => navigate('/member/exercises')}
                className="px-4 bg-surface-container-highest text-on-surface-variant font-bold py-3.5 rounded-xl text-sm active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-sm">menu_book</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Browse Library link */}
      {selectedMuscles.length === 0 && (
        <ScrollReveal direction="up" delay={0.3}>
          <button
            onClick={() => navigate('/member/exercises')}
            className="w-full bg-surface-container border border-outline-variant/10 rounded-2xl p-4 flex items-center justify-between group card-hover"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">menu_book</span>
              <div>
                <p className="font-headline font-bold text-on-surface text-sm text-left">Browse All 125 Exercises</p>
                <p className="text-on-surface-variant text-[10px]">Full library with GIF demonstrations</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant/30 group-hover:text-primary transition-colors">arrow_forward</span>
          </button>
        </ScrollReveal>
      )}
    </div>
  )
}
