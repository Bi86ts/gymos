import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { generateWorkoutPlan } from '../../services/geminiService'
import muscleGroupMap from '../../data/muscleGroupMap'
import { getExercisesByMuscle, findBestExerciseMatch } from '../../data/exerciseData'
import GlowOrbs from '../../components/effects/GlowOrbs'
import ScrollReveal from '../../components/effects/ScrollReveal'
import AnimatedCounter from '../../components/effects/AnimatedCounter'

function SkeletonCard() {
  return (
    <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/10 space-y-3">
      <div className="h-4 w-3/4 bg-surface-container-highest rounded-md skeleton-pulse" />
      <div className="h-3 w-1/2 bg-surface-container-highest rounded-md skeleton-pulse" style={{ animationDelay: '0.2s' }} />
      <div className="h-3 w-2/3 bg-surface-container-highest rounded-md skeleton-pulse" style={{ animationDelay: '0.4s' }} />
    </div>
  )
}

function ExerciseRow({ exercise, index, muscleGroup }) {
  const [expanded, setExpanded] = useState(false)
  // Match AI exercise name to our database for GIF
  const match = findBestExerciseMatch(exercise.name)
  // Fallback: try to find any exercise from same muscle group
  const fallbackExercises = getExercisesByMuscle(muscleGroup)
  const fallback = fallbackExercises[index % fallbackExercises.length]
  const gifUrl = match?.gifUrl || fallback?.gifUrl

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="bg-surface-container rounded-2xl overflow-hidden border border-outline-variant/10 shadow-md"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center gap-4 text-left"
      >
        {/* GIF thumbnail */}
        <div className="w-12 h-12 rounded-xl overflow-hidden bg-surface-container-highest shrink-0">
          {gifUrl ? (
            <img src={gifUrl} alt={exercise.name} loading="lazy" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-sm">fitness_center</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-headline font-bold text-on-surface text-sm truncate">{exercise.name}</h4>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-[10px] text-primary font-bold">{exercise.sets} × {exercise.reps}</span>
            <span className="text-[10px] text-on-surface-variant">💤 {exercise.restSeconds}s</span>
          </div>
        </div>

        <span className={`material-symbols-outlined text-on-surface-variant/50 transition-transform duration-300 shrink-0 ${expanded ? 'rotate-180' : ''}`}>expand_more</span>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">
              {/* GIF Demo */}
              {gifUrl && (
                <div className="rounded-xl overflow-hidden bg-surface-container-highest">
                  <img src={gifUrl} alt={exercise.name} loading="lazy" className="w-full h-48 object-contain bg-surface-dim" />
                </div>
              )}

              {/* Matched exercise info */}
              {match && (
                <div className="bg-surface-container-highest/50 rounded-xl p-3 space-y-2">
                  <p className="text-on-surface text-xs leading-relaxed">{match.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {match.targetMuscles.map(m => (
                      <span key={m} className="text-[8px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">{m}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Coaching notes */}
              {exercise.notes && (
                <div className="flex items-start gap-2 bg-primary/5 rounded-xl p-3">
                  <span className="material-symbols-outlined text-primary text-sm mt-0.5">tips_and_updates</span>
                  <p className="text-on-surface text-xs leading-relaxed">{exercise.notes}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function WorkoutPlanView() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const muscleParam = searchParams.get('muscle') || 'Chest'
  const muscles = muscleParam.split(',').map(m => m.trim())
  const muscleLabel = muscles.join(' + ')
  const firstMuscleData = muscleGroupMap[muscles[0]]

  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      let userProfile = {}
      try {
        const saved = localStorage.getItem('gymos_member')
        if (saved) userProfile = JSON.parse(saved)
      } catch (e) {}

      const streak = 12

      try {
        const result = await generateWorkoutPlan(muscleParam, userProfile, streak)
        if (!cancelled) {
          setPlan(result)
          setLoading(false)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message)
          setLoading(false)
        }
      }
    }

    load()
    return () => { cancelled = true }
  }, [muscleParam])

  const handleRegenerate = () => {
    setPlan(null)
    setLoading(true)
    setError(null)
    // Clear cache and reload
    const cacheKey = `workout_plan_${muscles.sort().join('_')}`
    try { sessionStorage.removeItem(cacheKey) } catch(e) {}
    window.location.reload()
  }

  return (
    <div className="space-y-6 pb-8 relative">
      <GlowOrbs variant="section" />

      {/* Back + Header */}
      <ScrollReveal direction="up">
        <div>
          <button
            onClick={() => navigate('/member/muscle-select')}
            className="flex items-center gap-1 text-on-surface-variant text-xs mb-3 hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to Muscle Selector
          </button>

          <div className="flex items-center gap-3 mb-1">
            {firstMuscleData && (
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${firstMuscleData.color}20` }}>
                <span className="material-symbols-outlined text-lg" style={{ color: firstMuscleData.color }}>{firstMuscleData.icon}</span>
              </div>
            )}
            <div>
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">AI-GENERATED PLAN</span>
              <h1 className="font-headline text-2xl font-black text-on-surface uppercase italic">{muscleLabel} Workout</h1>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Loading */}
      {loading && (
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface-container rounded-2xl p-6 border border-outline-variant/10 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <div>
              <p className="font-headline font-bold text-on-surface text-sm">Generating your workout...</p>
              <p className="text-on-surface-variant text-xs mt-1">Gemini AI is building a personalized {muscleLabel.toLowerCase()} plan</p>
            </div>
          </motion.div>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="bg-error/10 border border-error/30 rounded-2xl p-4 flex items-start gap-3">
          <span className="material-symbols-outlined text-error mt-0.5">error</span>
          <div>
            <p className="text-error font-bold text-sm">Generation failed</p>
            <p className="text-on-surface-variant text-xs mt-1">{error}</p>
            <button onClick={handleRegenerate} className="mt-3 text-xs font-bold text-primary hover:underline">Try again</button>
          </div>
        </div>
      )}

      {/* Generated Plan */}
      {plan && !loading && (
        <>
          {/* Plan Overview */}
          <ScrollReveal direction="up" delay={0.1}>
            <div className="bg-gradient-to-br from-surface-container to-surface-container-high rounded-2xl p-5 border border-primary/15 shadow-lg relative overflow-hidden">
              <div className="absolute -right-6 -top-6 opacity-10">
                <span className="material-symbols-outlined text-8xl text-primary" style={{fontVariationSettings: "'FILL' 1"}}>bolt</span>
              </div>
              <div className="relative z-10">
                <h2 className="font-headline font-black text-on-surface text-lg uppercase">{plan.planName}</h2>
                <div className="flex items-center gap-4 mt-3 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-sm">timer</span>
                    <span className="text-xs font-bold text-on-surface">{plan.estimatedDuration}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-sm">signal_cellular_alt</span>
                    <span className="text-xs font-bold text-on-surface">{plan.difficulty}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-sm">fitness_center</span>
                    <span className="text-xs font-bold text-on-surface">
                      <AnimatedCounter to={plan.exercises?.length || 0} suffix=" exercises" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Motivation */}
          {plan.motivation && (
            <ScrollReveal direction="up" delay={0.15}>
              <div className="bg-primary/5 border border-primary/15 rounded-xl p-4 flex items-start gap-3">
                <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>local_fire_department</span>
                <p className="text-on-surface text-sm italic leading-relaxed">"{plan.motivation}"</p>
              </div>
            </ScrollReveal>
          )}

          {/* Warm-up */}
          {plan.warmup && (
            <ScrollReveal direction="up" delay={0.2}>
              <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-yellow-400 text-sm">whatshot</span>
                  <h3 className="text-[10px] font-black text-on-surface uppercase tracking-widest">Warm-Up</h3>
                  <span className="text-[10px] text-on-surface-variant ml-auto">{plan.warmup.duration}</span>
                </div>
                <p className="text-on-surface-variant text-xs leading-relaxed">{plan.warmup.description}</p>
              </div>
            </ScrollReveal>
          )}

          {/* Exercise List */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Exercises</h3>
            {plan.exercises?.map((exercise, i) => (
              <ExerciseRow key={i} exercise={exercise} index={i} muscleGroup={muscles[0]} />
            ))}
          </div>

          {/* Cool-down */}
          {plan.cooldown && (
            <ScrollReveal direction="up" delay={0.1}>
              <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-blue-400 text-sm">ac_unit</span>
                  <h3 className="text-[10px] font-black text-on-surface uppercase tracking-widest">Cool-Down</h3>
                  <span className="text-[10px] text-on-surface-variant ml-auto">{plan.cooldown.duration}</span>
                </div>
                <p className="text-on-surface-variant text-xs leading-relaxed">{plan.cooldown.description}</p>
              </div>
            </ScrollReveal>
          )}

          {/* Start + Regenerate */}
          <ScrollReveal direction="up" delay={0.2}>
            <Link
              to="/member/plan"
              className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary-fixed font-black py-5 rounded-2xl text-lg shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>play_circle</span>
              START WORKOUT
            </Link>
          </ScrollReveal>
          <div className="text-center">
            <button onClick={handleRegenerate} className="text-[10px] text-on-surface-variant hover:text-primary uppercase tracking-widest font-bold transition-colors">
              ↻ Regenerate Plan
            </button>
          </div>
        </>
      )}
    </div>
  )
}
