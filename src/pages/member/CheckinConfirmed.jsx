import { Link } from 'react-router-dom'

export default function CheckinConfirmed() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6 pb-8">
      {/* Success Animation */}
      <div className="relative mb-8">
        <div className="w-28 h-28 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-6xl" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
        </div>
        <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-error/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-error text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>local_fire_department</span>
        </div>
      </div>

      <h2 className="font-headline text-3xl font-black tracking-tight mb-2">YOU'RE IN.</h2>
      <p className="text-on-surface-variant text-lg mb-8">Check-in confirmed. The Forge awaits.</p>

      {/* Streak Update */}
      <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/5 w-full max-w-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Streak Updated</span>
          <span className="material-symbols-outlined text-error" style={{fontVariationSettings: "'FILL' 1"}}>local_fire_department</span>
        </div>
        <p className="font-headline text-4xl font-black text-primary">13 DAYS</p>
        <p className="text-xs text-on-surface-variant mt-1">Your longest streak: 18 days. Keep pushing.</p>
      </div>

      {/* Today's Quick View */}
      <div className="bg-surface-container p-5 rounded-xl border border-outline-variant/5 w-full max-w-sm mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="material-symbols-outlined text-primary">fitness_center</span>
          <div>
            <p className="font-headline font-bold text-sm">Push Day - Hypertrophy</p>
            <p className="text-[10px] text-on-surface-variant">Chest / Shoulders / Triceps · 75 min</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-surface-container-low p-2 rounded text-center">
            <p className="text-xs font-bold">6</p>
            <p className="text-[8px] text-on-surface-variant uppercase">Exercises</p>
          </div>
          <div className="bg-surface-container-low p-2 rounded text-center">
            <p className="text-xs font-bold">20</p>
            <p className="text-[8px] text-on-surface-variant uppercase">Sets</p>
          </div>
          <div className="bg-surface-container-low p-2 rounded text-center">
            <p className="text-xs font-bold">12.5k</p>
            <p className="text-[8px] text-on-surface-variant uppercase">Volume</p>
          </div>
        </div>
      </div>

      <Link
        to="/member/plan"
        className="w-full max-w-sm bg-gradient-to-r from-primary to-primary-container text-on-primary-fixed font-black py-4 rounded-full text-lg shadow-lg shadow-primary/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>play_arrow</span>
        START WORKOUT
      </Link>
    </div>
  )
}
