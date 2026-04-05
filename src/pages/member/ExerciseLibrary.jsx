import { useState, useMemo } from 'react'
import exercises, { muscleGroups, equipmentTypes, difficultyLevels, searchExercises } from '../../data/exerciseData'
import GlowOrbs from '../../components/effects/GlowOrbs'
import ScrollReveal from '../../components/effects/ScrollReveal'

function ExerciseCard({ exercise, onClick }) {
  const [imgLoaded, setImgLoaded] = useState(false)

  const difficultyColor = {
    Beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
    Intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    Advanced: 'bg-red-500/20 text-red-400 border-red-500/30',
  }

  return (
    <div
      onClick={() => onClick(exercise)}
      className="bg-surface-container rounded-2xl overflow-hidden border border-outline-variant/10 shadow-md card-hover cursor-pointer group"
    >
      {/* GIF Preview */}
      <div className="relative h-44 bg-surface-container-highest overflow-hidden">
        {!imgLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        )}
        <img
          src={exercise.gifUrl}
          alt={`${exercise.name} demonstration`}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
        <div className="absolute top-2 right-2">
          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-md border ${difficultyColor[exercise.difficulty]}`}>
            {exercise.difficulty}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-headline font-bold text-on-surface text-sm mb-1 group-hover:text-primary transition-colors">{exercise.name}</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">{exercise.muscleGroup}</span>
          <span className="text-[9px] font-bold text-on-surface-variant/60 bg-surface-container-highest px-2 py-0.5 rounded-md">{exercise.equipment}</span>
        </div>
      </div>
    </div>
  )
}

function ExerciseDetailModal({ exercise, onClose }) {
  if (!exercise) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-2xl max-h-[85vh] bg-surface-container-low rounded-t-3xl overflow-y-auto border-t border-outline-variant/20 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <div className="sticky top-0 z-10 bg-surface-container-low/90 backdrop-blur-xl px-6 py-4 flex justify-between items-center border-b border-outline-variant/10">
          <h2 className="font-headline font-bold text-on-surface text-lg">{exercise.name}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        {/* GIF */}
        <div className="px-6 pt-4">
          <div className="rounded-2xl overflow-hidden bg-surface-container-highest">
            <img src={exercise.gifUrl} alt={exercise.name} className="w-full h-64 object-contain bg-surface-dim" />
          </div>
        </div>

        {/* Details */}
        <div className="p-6 space-y-6">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-lg">{exercise.muscleGroup}</span>
            <span className="text-xs font-bold text-on-surface-variant bg-surface-container-highest px-3 py-1 rounded-lg">{exercise.equipment}</span>
            <span className="text-xs font-bold text-on-surface-variant bg-surface-container-highest px-3 py-1 rounded-lg">{exercise.difficulty}</span>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2">Description</h3>
            <p className="text-on-surface text-sm leading-relaxed">{exercise.description}</p>
          </div>

          {/* Target Muscles */}
          <div>
            <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2">Target Muscles</h3>
            <div className="flex flex-wrap gap-2">
              {exercise.targetMuscles.map(m => (
                <span key={m} className="text-xs text-primary border border-primary/30 px-3 py-1 rounded-lg">{m}</span>
              ))}
            </div>
          </div>

          {/* Step-by-step Instructions */}
          <div>
            <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-3">How To Perform</h3>
            <ol className="space-y-3">
              {exercise.instructions.map((step, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-black flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                  <span className="text-on-surface text-sm leading-relaxed">{step}</span>
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
      className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-all active:scale-95 ${
        active
          ? 'bg-primary text-on-primary border-primary shadow-md shadow-primary/20'
          : 'bg-surface-container text-on-surface-variant border-outline-variant/20 hover:border-primary/40'
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
        <div>
          <h1 className="font-headline text-3xl font-black text-on-surface uppercase italic">Exercise Library</h1>
          <p className="text-on-surface-variant text-sm mt-1">{exercises.length} exercises with video demonstrations</p>
        </div>
      </ScrollReveal>

      {/* Search */}
      <ScrollReveal direction="up" delay={0.1}>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-lg">search</span>
          <input
            type="text"
            placeholder="Search exercises, muscles, equipment..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container border border-outline-variant/20 rounded-xl pl-10 pr-4 py-3 text-on-surface text-sm placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>
      </ScrollReveal>

      {/* Filters */}
      <ScrollReveal direction="up" delay={0.15}>
        <div className="space-y-3">
          {/* Muscle Group */}
          <div>
            <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest mb-2">Body Part</p>
            <div className="flex flex-wrap gap-2">
              <FilterChip label="All" active={selectedMuscle === 'All'} onClick={() => setSelectedMuscle('All')} />
              {muscleGroups.map(m => (
                <FilterChip key={m} label={m} active={selectedMuscle === m} onClick={() => setSelectedMuscle(m)} />
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest mb-2">Difficulty</p>
            <div className="flex flex-wrap gap-2">
              <FilterChip label="All" active={selectedDifficulty === 'All'} onClick={() => setSelectedDifficulty('All')} />
              {difficultyLevels.map(d => (
                <FilterChip key={d} label={d} active={selectedDifficulty === d} onClick={() => setSelectedDifficulty(d)} />
              ))}
            </div>
          </div>

          {/* Equipment */}
          <div>
            <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest mb-2">Equipment</p>
            <div className="flex flex-wrap gap-2">
              <FilterChip label="All" active={selectedEquipment === 'All'} onClick={() => setSelectedEquipment('All')} />
              {equipmentTypes.map(eq => (
                <FilterChip key={eq} label={eq} active={selectedEquipment === eq} onClick={() => setSelectedEquipment(eq)} />
              ))}
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
