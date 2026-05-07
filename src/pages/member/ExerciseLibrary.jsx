import { useState, useMemo } from 'react'
import exercises, { muscleGroups, equipmentTypes, difficultyLevels, searchExercises } from '../../data/exerciseData'
import GlowOrbs from '../../components/effects/GlowOrbs'
import ScrollReveal from '../../components/effects/ScrollReveal'

function ExerciseCard({ exercise, onClick }) {
  const [imgLoaded, setImgLoaded] = useState(false)

  const difficultyStyles = {
    Beginner: { text: 'text-[#00FFAA]', bg: 'bg-[#00FFAA]/10', border: 'border-[#00FFAA]/20' },
    Intermediate: { text: 'text-[#FF9500]', bg: 'bg-[#FF9500]/10', border: 'border-[#FF9500]/20' },
    Advanced: { text: 'text-[#FF2D55]', bg: 'bg-[#FF2D55]/10', border: 'border-[#FF2D55]/20' },
  }

  const ds = difficultyStyles[exercise.difficulty]

  return (
    <div
      onClick={() => onClick(exercise)}
      className="bg-[#111316] rounded-3xl overflow-hidden border border-outline-variant/5 shadow-xl hover:border-white/10 transition-all cursor-pointer group flex flex-col h-full"
    >
      {/* GIF Preview */}
      <div className="relative h-44 bg-[#06060B] overflow-hidden">
        {!imgLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          </div>
        )}
        <img
          src={exercise.gifUrl}
          alt={exercise.name}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover grayscale opacity-50 transition-all duration-700 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 ${imgLoaded ? '' : 'hidden'}`}
        />
        <div className="absolute top-3 right-3">
          <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border backdrop-blur-md ${ds.text} ${ds.bg} ${ds.border}`}>
            {exercise.difficulty}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-headline font-black text-white text-[13px] uppercase italic tracking-tight mb-2 group-hover:text-primary transition-colors line-clamp-1">{exercise.name}</h3>
        <div className="flex items-center gap-2 flex-wrap mt-auto">
          <span className="text-[8px] font-black text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md uppercase tracking-widest">{exercise.muscleGroup}</span>
          <span className="text-[8px] font-black text-on-surface-variant/60 bg-white/5 border border-outline-variant/10 px-2 py-0.5 rounded-md uppercase tracking-widest">{exercise.equipment}</span>
        </div>
      </div>
    </div>
  )
}

function ExerciseDetailModal({ exercise, onClose }) {
  if (!exercise) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-[#06060B]/80 backdrop-blur-xl" />
      <div
        className="relative w-full max-w-2xl max-h-[90vh] bg-[#111316] rounded-t-[40px] overflow-y-auto border-t border-outline-variant/20 shadow-2xl animate-in slide-in-from-bottom-full duration-500"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mt-4" />
        
        {/* Close Button at top corner */}
        <button onClick={onClose} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 border border-outline-variant/10 flex items-center justify-center text-on-surface-variant hover:text-white transition-all z-20">
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        {/* Header Section */}
        <div className="px-6 pt-10 pb-4">
           <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] block mb-2">Module Breakdown</span>
           <h2 className="font-headline font-black text-white text-3xl uppercase italic tracking-tighter leading-tight">{exercise.name}</h2>
        </div>

        {/* GIF Hero */}
        <div className="px-6 mb-8">
          <div className="rounded-[32px] overflow-hidden bg-[#06060B] border border-outline-variant/10 relative group">
            <img src={exercise.gifUrl} alt={exercise.name} className="w-full h-80 object-contain grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#06060B] via-transparent to-transparent opacity-40" />
          </div>
        </div>

        {/* Details Grid */}
        <div className="px-6 pb-12 space-y-8">
          {/* Metadata Chips */}
          <div className="flex flex-wrap gap-2.5">
            <div className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-2xl flex items-center gap-2">
               <span className="material-symbols-outlined text-sm text-primary">target</span>
               <span className="text-[10px] font-black text-primary uppercase tracking-widest">{exercise.muscleGroup}</span>
            </div>
            <div className="px-4 py-2 bg-white/5 border border-outline-variant/10 rounded-2xl flex items-center gap-2">
               <span className="material-symbols-outlined text-sm text-on-surface-variant">hardware</span>
               <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">{exercise.equipment}</span>
            </div>
            <div className="px-4 py-2 bg-white/5 border border-outline-variant/10 rounded-2xl flex items-center gap-2">
               <span className="material-symbols-outlined text-sm text-on-surface-variant">speed</span>
               <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">{exercise.difficulty}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Description */}
            <div className="space-y-4">
              <h3 className="text-[9px] font-black text-on-surface-variant/50 uppercase tracking-[0.2em] px-1">Overview</h3>
              <p className="text-white/80 text-sm leading-relaxed font-medium px-1 italic border-l-2 border-primary/30 pl-4">{exercise.description}</p>
            </div>

            {/* Target Muscles */}
            <div className="space-y-4">
              <h3 className="text-[9px] font-black text-on-surface-variant/50 uppercase tracking-[0.2em] px-1">Effectors</h3>
              <div className="flex flex-wrap gap-2 px-1">
                {exercise.targetMuscles.map(m => (
                  <span key={m} className="text-[9px] font-black text-white/60 bg-white/5 border border-outline-variant/10 px-3 py-1.5 rounded-xl uppercase tracking-widest">{m}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Step-by-step Instructions */}
          <div className="bg-white/[0.02] rounded-[32px] p-8 border border-outline-variant/5">
            <h3 className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">list_alt</span>
              Protocol Steps
            </h3>
            <ol className="space-y-6">
              {exercise.instructions.map((step, i) => (
                <li key={i} className="flex gap-5 items-start group">
                  <span className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/30 text-primary text-xs font-black flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform">{i + 1}</span>
                  <span className="text-white/70 text-sm leading-relaxed font-medium group-hover:text-white transition-colors">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ExerciseLibrary() {
  const [selectedMuscle, setSelectedMuscle] = useState('All')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [selectedEquipment, setSelectedEquipment] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedExercise, setSelectedExercise] = useState(null)

  const filteredExercises = useMemo(() => {
    let results = searchQuery ? searchExercises(searchQuery) : [...exercises]
    if (selectedMuscle !== 'All') results = results.filter(e => e.muscleGroup === selectedMuscle)
    if (selectedDifficulty !== 'All') results = results.filter(e => e.difficulty === selectedDifficulty)
    if (selectedEquipment !== 'All') results = results.filter(e => e.equipment === selectedEquipment)
    return results
  }, [selectedMuscle, selectedDifficulty, selectedEquipment, searchQuery])

  const FilterChip = ({ label, active, onClick }) => (
    <button
      onClick={onClick}
      className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border transition-all active:scale-95 ${
        active
          ? 'bg-primary text-[#06060B] border-primary shadow-lg shadow-primary/20'
          : 'bg-[#111316] text-on-surface-variant border-outline-variant/10 hover:border-white/20'
      }`}
    >
      {label}
    </button>
  )

  return (
    <div className="space-y-6 pb-8 relative">
      <GlowOrbs variant="subtle" />

      {/* Header */}
      <ScrollReveal direction="up">
        <div className="flex justify-between items-end mb-2">
          <div>
            <h1 className="font-headline text-3xl font-black text-white uppercase italic tracking-tight">Explore</h1>
            <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mt-1 opacity-60">Neural Knowledge Base</p>
          </div>
          <div className="bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
             <span className="text-[9px] font-black text-primary uppercase tracking-widest">{exercises.length} Total Modules</span>
          </div>
        </div>
      </ScrollReveal>

      {/* Search */}
      <ScrollReveal direction="up" delay={0.1}>
        <div className="relative group">
          <div className="absolute inset-0 bg-primary/5 rounded-[24px] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 text-xl group-focus-within:text-primary transition-colors">search</span>
          <input
            type="text"
            placeholder="Query exercise, muscle, or equipment..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#111316] border border-outline-variant/10 rounded-[24px] pl-12 pr-6 py-4.5 text-white text-sm placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all relative z-10"
          />
        </div>
      </ScrollReveal>

      {/* Filters */}
      <ScrollReveal direction="up" delay={0.15}>
        <div className="bg-[#111316] rounded-[32px] p-6 border border-outline-variant/5 shadow-xl space-y-6">
          {/* Muscle Group */}
          <div>
            <p className="text-[9px] font-black text-on-surface-variant/50 uppercase tracking-[0.2em] mb-3 px-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-xs text-primary" style={{fontVariationSettings: "'FILL' 1"}}>target</span>
              Biological Vector
            </p>
            <div className="flex flex-wrap gap-2.5">
              <FilterChip label="All Part" active={selectedMuscle === 'All'} onClick={() => setSelectedMuscle('All')} />
              {muscleGroups.map(m => (
                <FilterChip key={m} label={m} active={selectedMuscle === m} onClick={() => setSelectedMuscle(m)} />
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-[9px] font-black text-on-surface-variant/50 uppercase tracking-[0.2em] mb-3 px-1">Intensity Level</p>
              <div className="flex flex-wrap gap-2">
                <FilterChip label="All" active={selectedDifficulty === 'All'} onClick={() => setSelectedDifficulty('All')} />
                {difficultyLevels.map(d => (
                  <FilterChip key={d} label={d} active={selectedDifficulty === d} onClick={() => setSelectedDifficulty(d)} />
                ))}
              </div>
            </div>

            {/* Equipment */}
            <div>
              <p className="text-[9px] font-black text-on-surface-variant/50 uppercase tracking-[0.2em] mb-3 px-1">Hardware Type</p>
              <div className="flex flex-wrap gap-2">
                <FilterChip label="All" active={selectedEquipment === 'All'} onClick={() => setSelectedEquipment('All')} />
                {equipmentTypes.map(eq => (
                  <FilterChip key={eq} label={eq} active={selectedEquipment === eq} onClick={() => setSelectedEquipment(eq)} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
          {filteredExercises.length} exercise{filteredExercises.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Exercise Grid */}
      <div className="grid grid-cols-2 gap-3">
        {filteredExercises.map((exercise, i) => (
          <ScrollReveal key={exercise.id} direction="up" delay={Math.min(i * 0.05, 0.3)}>
            <ExerciseCard exercise={exercise} onClick={setSelectedExercise} />
          </ScrollReveal>
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <div className="text-center py-12">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant/30">search_off</span>
          <p className="text-on-surface-variant text-sm mt-3">No exercises match your filters</p>
        </div>
      )}

      {/* Detail Modal */}
      {selectedExercise && (
        <ExerciseDetailModal exercise={selectedExercise} onClose={() => setSelectedExercise(null)} />
      )}
    </div>
  )
}
