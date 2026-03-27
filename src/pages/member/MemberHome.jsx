import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function MemberHome() {
  const [checkedIn, setCheckedIn] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="space-y-8 pb-8">
      {/* Daily Check-in CTA */}
      {!checkedIn ? (
        <section className="bg-surface-container-low rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -mr-16 -mt-16 rounded-full blur-3xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="font-headline text-xl font-bold text-on-surface leading-tight">Are you coming in today?</h3>
              <p className="text-on-surface-variant text-sm mt-1">The Forge is hot. Your spot is waiting.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setCheckedIn(true); navigate('/member/checkin') }}
                className="bg-primary hover:opacity-80 transition-all active:scale-95 px-6 py-2.5 rounded-full text-on-primary-fixed font-bold text-sm"
              >
                YES, SECURE SPOT
              </button>
              <Link
                to="/member/skip"
                className="border border-outline-variant/20 hover:bg-surface-container-highest transition-all active:scale-95 px-6 py-2.5 rounded-full text-on-surface-variant font-bold text-sm"
              >
                NO / SKIP
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-surface-container-low rounded-xl p-6 relative overflow-hidden border border-primary/20">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
            <div>
              <h3 className="font-headline text-lg font-bold text-primary">You're checked in!</h3>
              <p className="text-on-surface-variant text-sm">Your spot is secured. Let's crush it.</p>
            </div>
          </div>
        </section>
      )}

      {/* Today's Workout Card */}
      <section className="relative">
        <div className="bg-surface-container rounded-xl overflow-hidden border border-outline-variant/10 shadow-2xl">
          <div className="h-48 relative bg-gradient-to-br from-surface-container-highest to-surface-container">
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <span className="material-symbols-outlined text-9xl text-primary">fitness_center</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent"></div>
            <div className="absolute bottom-4 left-6">
              <span className="bg-primary/20 text-primary text-[10px] font-black tracking-widest uppercase px-2 py-1 rounded">TODAY'S PROTOCOL</span>
              <h2 className="text-3xl font-black font-headline text-on-surface mt-2 tracking-tight italic uppercase">Push Day - Hypertrophy</h2>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-surface-container-low p-3 rounded-lg border-l-2 border-primary">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Volume</p>
                <p className="text-lg font-headline font-bold text-on-surface">12.5k lbs</p>
              </div>
              <div className="bg-surface-container-low p-3 rounded-lg border-l-2 border-secondary">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Duration</p>
                <p className="text-lg font-headline font-bold text-on-surface">75 mins</p>
              </div>
              <div className="bg-surface-container-low p-3 rounded-lg border-l-2 border-primary-dim">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Focus</p>
                <p className="text-lg font-headline font-bold text-on-surface">Chest/Tri</p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                to="/member/plan"
                className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary-fixed font-black py-4 rounded-full text-lg shadow-lg shadow-primary/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>play_arrow</span>
                START SESSION
              </Link>
              <button className="w-full text-primary-dim font-bold py-2 text-sm uppercase tracking-widest hover:text-primary transition-colors">
                RESCHEDULE WORKOUT
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Behavioral Metrics */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Consistency Score */}
        <div className="bg-surface-container-low p-6 rounded-xl flex items-center justify-between border border-outline-variant/5">
          <div className="space-y-1">
            <h4 className="text-on-surface-variant text-[11px] font-black uppercase tracking-widest">Consistency Score</h4>
            <p className="text-2xl font-headline font-black text-on-surface">ELITE LEVEL</p>
            <p className="text-xs text-primary/80">+5% from last week</p>
          </div>
          <div className="relative w-20 h-20">
            <svg className="performance-ring w-full h-full" viewBox="0 0 100 100">
              <circle className="text-surface-container-highest" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"></circle>
              <circle className="text-primary" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset="30.1" strokeLinecap="round" strokeWidth="10"></circle>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-headline font-black text-on-surface">88</span>
            </div>
          </div>
        </div>
        {/* Streak */}
        <div className="bg-surface-container-low p-6 rounded-xl flex items-center justify-between border border-outline-variant/5 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-2 opacity-10">
            <span className="material-symbols-outlined text-7xl" style={{fontVariationSettings: "'FILL' 1"}}>local_fire_department</span>
          </div>
          <div className="space-y-1 relative z-10">
            <h4 className="text-on-surface-variant text-[11px] font-black uppercase tracking-widest">Current Momentum</h4>
            <p className="text-2xl font-headline font-black text-on-surface flex items-center gap-2">
              12 DAY STREAK
              <span className="material-symbols-outlined text-error" style={{fontVariationSettings: "'FILL' 1"}}>local_fire_department</span>
            </p>
            <p className="text-xs text-on-surface-variant">Don't break the chain, Alex.</p>
          </div>
        </div>
      </section>

      {/* Vital Insights */}
      <section className="space-y-4">
        <h3 className="font-headline text-lg font-bold text-on-surface-variant uppercase tracking-widest">Vital Insights</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: 'monitor_heart', value: '64', label: 'Avg RHR', color: 'text-primary' },
            { icon: 'sleep', value: '7.4h', label: 'Recovery', color: 'text-secondary' },
            { icon: 'local_fire_department', value: '840', label: 'Avg Burn', color: 'text-error' },
            { icon: 'water_drop', value: '2.8L', label: 'Hydration', color: 'text-primary-dim' },
          ].map((item) => (
            <div key={item.label} className="bg-surface-container p-4 rounded-xl flex flex-col justify-between aspect-square group hover:bg-surface-container-highest transition-colors">
              <span className={`material-symbols-outlined ${item.color}`}>{item.icon}</span>
              <div>
                <p className="text-2xl font-headline font-black">{item.value}</p>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
