import { useState } from 'react'
import { Link } from 'react-router-dom'

const goals = [
  { id: 'muscle', title: 'Build Muscle', desc: 'Hypertrophy focused training for maximum strength and size gains.', icon: 'fitness_center' },
  { id: 'weight', title: 'Lose Weight', desc: 'Efficient calorie burning and metabolic conditioning routines.', icon: 'local_fire_department' },
  { id: 'stamina', title: 'Increase Stamina', desc: 'Endurance-based protocols to boost cardiovascular performance.', icon: 'bolt' },
  { id: 'health', title: 'General Health', desc: 'Balanced wellness programming for longevity and mobility.', icon: 'favorite' },
]

export default function GoalSelection() {
  const [selected, setSelected] = useState(null)

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 flex items-center justify-between px-6 py-4 bg-surface">
        <Link to="/" className="material-symbols-outlined text-primary active:scale-95 duration-150">arrow_back</Link>
        <h1 className="font-headline font-bold tracking-tight text-xl uppercase text-primary">GymOS</h1>
        <div className="w-6"></div>
      </header>
      <div className="fixed top-[60px] left-0 bg-surface-container-low h-1.5 w-full z-40"></div>

      <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto flex flex-col">
        {/* Progress */}
        <section className="mb-12">
          <div className="flex justify-between items-end mb-4">
            <p className="font-label text-primary text-xs font-bold uppercase tracking-widest">Step 01 <span className="text-on-surface-variant font-medium">/ 04</span></p>
            <p className="font-headline text-on-surface-variant text-sm font-medium">Goal Alignment</p>
          </div>
          <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full w-1/4 bg-gradient-to-r from-primary to-primary-container rounded-full"></div>
          </div>
        </section>

        {/* Headline */}
        <section className="mb-10">
          <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight leading-none mb-4">What's your primary <span className="text-primary italic">fitness focus?</span></h2>
          <p className="text-on-surface-variant text-lg">Select the path that matches your current ambition. We'll tailor your experience accordingly.</p>
        </section>

        {/* Goal Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal) => (
            <button
              key={goal.id}
              onClick={() => setSelected(goal.id)}
              className={`group relative flex flex-col items-start p-6 transition-all duration-300 rounded-xl text-left border overflow-hidden active:scale-[0.98] ${
                selected === goal.id
                  ? 'bg-surface-container-highest border-primary/30 ring-2 ring-primary/20'
                  : 'bg-surface-container border-outline-variant/10 hover:bg-surface-container-highest'
              }`}
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-8xl">{goal.icon}</span>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 transition-colors ${selected === goal.id ? 'bg-primary' : 'bg-primary/10 group-hover:bg-primary'}`}>
                <span className={`material-symbols-outlined ${selected === goal.id ? 'text-on-primary-fixed' : 'text-primary group-hover:text-on-primary-fixed'}`} style={{fontVariationSettings: "'FILL' 1"}}>{goal.icon}</span>
              </div>
              <h3 className="font-headline text-xl font-bold mb-2">{goal.title}</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">{goal.desc}</p>
            </button>
          ))}
        </div>

        {/* Info Card */}
        <div className="mt-12 p-8 rounded-2xl bg-surface-container-low border border-outline-variant/5 relative overflow-hidden">
          <div className="relative z-10">
            <span className="inline-block px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase tracking-tighter mb-3">Science Backed</span>
            <p className="text-on-surface font-medium max-w-xs">All paths are dynamically adjusted based on your recovery metrics.</p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-primary/5 to-transparent skew-x-12 transform translate-x-16"></div>
        </div>
      </main>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 w-full z-50 p-6 flex items-center justify-center bg-surface/80 backdrop-blur-xl">
        <div className="max-w-2xl w-full">
          <Link
            to="/member/onboarding/fitness"
            className={`w-full py-5 px-8 rounded-full font-headline font-bold text-lg uppercase tracking-wider flex items-center justify-center gap-3 active:scale-95 transition-all shadow-[0_4px_24px_rgba(243,255,202,0.2)] ${
              selected
                ? 'bg-gradient-to-r from-primary to-primary-container text-on-primary-fixed'
                : 'bg-surface-container-highest text-on-surface-variant cursor-not-allowed'
            }`}
          >
            Continue
            <span className="material-symbols-outlined">trending_flat</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
